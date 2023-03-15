using System.Linq;
using System.Threading.Tasks;
using Eventos.Domain;
using Eventos.Persistence.Contexto;
using Eventos.Persistence.Contratos;
using Eventos.Persistence.models;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Persistence
{
    public class PalestrantePersistence : GeralPersistence, IPalestrantePersist
    {
        private readonly EventosContext _context;
        public PalestrantePersistence(EventosContext context) : base(context)
        {
            this._context = context;
            
        }

        public async Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.User)
            .Include(p => p.RedesSociais);

            if(includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
                .ThenInclude(pe => pe.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Id).Where(p => p.Id == userId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.User)
            .Include(p => p.RedesSociais);

            if(includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
                .ThenInclude(pe => pe.Evento);
            }

            query = query.AsNoTracking()
            .Where(p => 
                (p.MiniCurriculo.ToLower().Contains(pageParams.Term.ToLower()) ||
                p.User.PrimeiroNome.ToLower().Contains(pageParams.Term.ToLower()) ||
                p.User.UltimoNome.ToLower().Contains(pageParams.Term.ToLower())) &&
                p.User.Funcao == Domain.Enum.Funcao.Palestrante)
            .OrderBy(p => p.Id);

            return await PageList<Palestrante>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }
    }
}