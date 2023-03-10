using System.Threading.Tasks;
using Eventos.Domain;

namespace Eventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        //Lote
        /// <summary>
        /// método get que retornará uma lista de lotes por eventoId
        /// </summary>
        /// <param name="eventoId">código chave da tabela evento</param>
        /// <returns>Array de lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// método get que retornará apenas 1 lote
        /// </summary>
        /// <param name="eventoId">código chave da tabela evento</param>
        /// <param name="id">Código chave da tabela lote</param>
        /// <returns>Apenas 1 lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}