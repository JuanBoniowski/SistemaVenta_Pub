using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity; 

namespace SistemaVenta.BLL.Implementacion
{
    public class RolService : IRolService
    {

        private readonly IGenericRepository<Rol> _repsoitorio;

        public RolService(IGenericRepository<Rol> repsoitorio)
        {
            _repsoitorio = repsoitorio;
        }

        public async Task<List<Rol>> Lista()
        {
            IQueryable<Rol> query = await _repsoitorio.Consultar();

            return query.ToList();
        }
    }
}
