using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Eventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }
        [Required(ErrorMessage = "O Campo {0} é obrigatório."),
        MinLength(4, ErrorMessage = "O Campo {0} deve ter no mínimo 4 caracteres."),
        MaxLength(50, ErrorMessage = "O Campo {0} deve ter no máximo 50 caracteres.")
        //StringLength(50, MinimumLength = 3, ErrorMessage = "Intervalo permitido de 3 a 50 caracteres")
        ]
        public string Tema { get; set; }
        [
        Display(Name = "Quantidade Pessoas"),
        Required(ErrorMessage = "O Campo {0} é obrigatório."),
        Range(1,120000, ErrorMessage = "{0} não pode ser menor que 1 e maior que 120.000.")
        ]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (Formatos aceitos: gif, jpeg, bmp ou png)")]
        public string ImagemURL { get; set; }
        [
        Required(ErrorMessage = "O Campo {0} é obrigatório."),
        Phone(ErrorMessage = "O Campo {0} está com número inválido.")
        ]
        public string Telefone { get; set; }
        [Required(ErrorMessage = "O Campo {0} é obrigatório."),
        Display(Name = "e-mail"),
        EmailAddress(ErrorMessage = "O Campo {0} deve ser válido.")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedeSociais { get; set; }
        public IEnumerable<PalestranteDto> PalestrantesEventos { get; set; }
    }
}