using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class LikeParams : PagingParams
    {
        public string? CurrentUserId { get; set; }
        public string Predicate { get; set; } = "liked";
    }
}