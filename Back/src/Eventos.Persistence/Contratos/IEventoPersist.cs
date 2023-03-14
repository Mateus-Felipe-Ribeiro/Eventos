using System.Threading.Tasks;
using Eventos.Domain;
using Eventos.Persistence.models;

namespace Eventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        //Eventos
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
    }
}