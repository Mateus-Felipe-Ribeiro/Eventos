using System.Linq;
using System.Threading.Tasks;
using Eventos.Domain;
using Eventos.Persistence.Contexto;
using Eventos.Persistence.Contratos;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Persistence
{
    public class LotePersistence : ILotePersist
    {
        private readonly EventosContext _context;
        public LotePersistence(EventosContext context)
        {
            this._context = context;
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking().Where(lote => lote.EventoId == eventoId && lote.Id == id);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking().Where(lote => lote.EventoId == eventoId);

            return await query.ToArrayAsync();
        }
    }
}