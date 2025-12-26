using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class MessageParams : PagingParams
    {
        public string? MemberId { get; set; }
        public string Container { get; set; } = "Outbox";
    }
}