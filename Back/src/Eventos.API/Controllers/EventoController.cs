using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eventos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Eventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        public IEnumerable<Evento> _evento = new Evento[]
        {

                new Evento(){
                    EventoId = 1,
                    Tema = "exemplo de tema",
                    Local = "Aqui mesmo",
                    Lote = "1º",
                    QtdPessoas = 250,
                    DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                    ImagemURL = "img.jpg"
                },
                new Evento(){
                    EventoId = 2,
                    Tema = "exemplo de tema 2",
                    Local = "Aqui mesmo 2",
                    Lote = "2º",
                    QtdPessoas = 250,
                    DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                    ImagemURL = "img-ev2.jpg"
                }
        };

        public EventoController()
        {

        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> Get(int id)
        {
            return _evento.Where(evento => evento.EventoId == id);
        }

        [HttpPost]
        public string Post(){
            return "exemplo de post";
        }
    }
}
