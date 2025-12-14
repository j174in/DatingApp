using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PaginatedResults<T>
    {
        public PaginatedMetaData Metadata { get; set; } = default!;
        public List<T> Items { get; set; } = [];
    }

    public class PaginatedMetaData
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
    }

    public class PaginationHelper
    {
        public static async Task<PaginatedResults<T>> CreateAsync<T>(IQueryable<T> query, int pageSize, int pageNumber)
        {
            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedResults<T>
            {
                Metadata = new PaginatedMetaData
                {
                    CurrentPage = pageNumber,
                    TotalPages = (int)Math.Ceiling(count / (double)pageSize),
                    Count = count,
                    PageSize = pageSize
                },
                Items = items
            };
        }
    }
}