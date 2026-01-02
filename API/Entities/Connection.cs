namespace API.Entities
{
    public class Connection(string connectionId, string userId)
    {
        public string ConnectionId { get; set; } = connectionId;
        public string UserId { get; set; } = userId;

        //nav properties
        public Group group { get; set; } = null!;
    }
}