using Microsoft.AspNetCore.Mvc;
using Eventos.Application.Contratos;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using Eventos.Application.Dtos;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using Eventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Eventos.Persistence.models;

namespace Eventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        
        private readonly IEventoService _eventoService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IAccountService _accountService;

        public EventosController(IEventoService eventoService,IAccountService accountService, IWebHostEnvironment HostEnvironment)
        {
            _accountService = accountService;
            _hostEnvironment = HostEnvironment;
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), pageParams, true);
                if (eventos == null) return NoContent();

                Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if (evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento ID: {id}. Erro: {ex.Message}");
            }
        }

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId){
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, true);
                if (evento == null) return BadRequest("Erro ao inserir evento.");

                var file = Request.Form.Files[0];
                if(file.Length > 0)
                {
                    DeleteImage(evento.ImagemURL);
                    evento.ImagemURL = await SaveImage(file);
                }
                var retorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);

                return Ok(retorno);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir Evento. Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model){
            try
            {
                var evento = await _eventoService.AddEvento(User.GetUserId(), model);
                if (evento == null) return BadRequest("Erro ao inserir evento.");

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir Evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model){
            try
            {
                var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
                if (evento == null) return BadRequest("Erro ao atualizar evento.");

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar Evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id){
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if (evento == null) return NoContent();

                if(await _eventoService.DeleteEvento(User.GetUserId(), id))
                {
                    DeleteImage(evento.ImagemURL);
                    return Ok(new { message = "Evento deletedo" });
                }
                else
                {
                    throw new Exception("Ocorreu um problema não específico ao tentar deletar o Evento.");
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar excluir Evento. Erro: {ex.Message}");
            }
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile){
            string imagemNome = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
            .Take(10).ToArray()).Replace(' ', '-');

            imagemNome = $"{imagemNome}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imagemNome);

            using (var filestream = new FileStream(imagePath, FileMode.Create)){
                await imageFile.CopyToAsync(filestream);
            }

            return imagemNome;
        }

        [NonAction]
        public void DeleteImage(string imagemNome){
            var imagemPath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imagemNome);
            if(System.IO.File.Exists(imagemPath))
                System.IO.File.Delete(imagemPath);
        }
    }
}
