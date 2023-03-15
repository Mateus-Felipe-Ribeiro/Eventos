using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eventos.Domain;
using Eventos.Persistence.Contexto;
using Eventos.Persistence.Contratos;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Persistence
{
    public class RedeSocialPersistence: GeralPersistence, IRedeSocialPersist
    {
        private readonly EventosContext _context;
        public RedeSocialPersistence(EventosContext context): base(context)
        {
            _context = context;
            
        }
        public async Task<RedeSocial> GetRedeSocialEventoByIdsAsync(int eventoId, int id) {
            IQueryable<RedeSocial> query = _context.RedeSociais;

            query = query.AsNoTracking().Where(rs => rs.EventoId == eventoId && rs.Id == id);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<RedeSocial> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int id) {
            IQueryable<RedeSocial> query = _context.RedeSociais;

            query = query.AsNoTracking().Where(rs => rs.PalestranteId == palestranteId && rs.Id == id);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<RedeSocial[]> GetAllByEventoIdAsync(int eventoId) {
            IQueryable<RedeSocial> query = _context.RedeSociais;

            query = query.AsNoTracking().Where(rs => rs.EventoId == eventoId);

            return await query.ToArrayAsync();
        }
        public async Task<RedeSocial[]> GetAllByPalestranteIdAsync(int palestranteId) {
            IQueryable<RedeSocial> query = _context.RedeSociais;

            query = query.AsNoTracking().Where(rs => rs.PalestranteId == palestranteId);

            return await query.ToArrayAsync();
        }
    }
}