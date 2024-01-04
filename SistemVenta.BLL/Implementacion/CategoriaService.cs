﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity; 

namespace SistemaVenta.BLL.Implementacion
{
    public class CategoriaService : ICategoriaService
    {

        private readonly IGenericRepository<Categoria> _reposiotrio;

        public CategoriaService(IGenericRepository<Categoria> repository)
        {
                _reposiotrio = repository;
        }

        public async Task<List<Categoria>> Lista()
        {
            IQueryable<Categoria> query = await _reposiotrio.Consultar(); 
            return query.ToList();
        }
        public async Task<Categoria> Crear(Categoria entidad)
        {
            try
            {
                Categoria categoria_creada = await _reposiotrio.Crear(entidad);

                if (categoria_creada.IdCategoria==0)
                {
                    throw new TaskCanceledException("No se pudo crear la categoria"); 
                }

                return categoria_creada;
            }
            catch 
            {

                throw;
            }
        }

        public async Task<Categoria> Editar(Categoria entidad)
        {
            try
            {
                Categoria categoria_encontrada = await _reposiotrio.Obtener(c => c.IdCategoria == entidad.IdCategoria);
                categoria_encontrada.Descripcion = entidad.Descripcion;
                categoria_encontrada.EsActivo = entidad.EsActivo;

                bool respuesta = await _reposiotrio.Editar(categoria_encontrada);

                if (!respuesta)
                {
                    throw new TaskCanceledException("no se pudo modificar la categoria"); 
                }
                return categoria_encontrada; 
            }
            catch 
            {

                throw;
            }
        }

        public async Task<bool> Eliminar(int idCategoria)
        {
            try
            {
                Categoria categoria_encontrada = await _reposiotrio.Obtener(c => c.IdCategoria == idCategoria);


                if (categoria_encontrada==null)
                {
                    throw new TaskCanceledException("no se pudo eliminar la categoria");

                }

                bool respuesta = await _reposiotrio.Eliminar(categoria_encontrada);

                if (!respuesta)
                {
                    throw new TaskCanceledException("no se pudo eliminar la categoria");

                }

                else return respuesta; 
            }
            catch 
            {

                throw;
            }
        }
    }
}
