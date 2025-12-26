using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSend { get; set; } = DateTime.UtcNow;
        public bool SenderDelete { get; set; }
        public bool ReceiverDelete { get; set; }

        //Nav propertiers
        public required string SenderId { get; set; }
        public Member Sender { get; set; } = null!;
        public required string RecipientId { get; set; }
        public Member Recipient { get; set; } = null!;


    }
}