using System.Threading.Tasks;
using Eventos.Persistence.Contexto;
using Eventos.Persistence.Contratos;

namespace Eventos.Persistence
{
    public class GeralPersistence : IGeralPersist
    {
        private readonly EventosContext _context;
        public GeralPersistence(EventosContext context)
        {
            this._context = context;
            
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _context.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}