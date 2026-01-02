using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly
            ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> onlineUsers = new();


        public Task UserConnected(string Id, string connectionId)
        {
            var connections = onlineUsers.GetOrAdd(Id, _ => new ConcurrentDictionary<string, byte>());
            connections.TryAdd(connectionId, 0);

            return Task.CompletedTask;

        }

        public Task UserDiconected(string Id, string connectionId)
        {
            if (onlineUsers.TryGetValue(Id, out var connections))
            {
                connections.TryRemove(connectionId, out _);
                if (connections.IsEmpty)
                {
                    onlineUsers.TryRemove(Id, out _);
                }
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            return Task.FromResult(onlineUsers.Keys.OrderBy(k => k).ToArray());
        }

        public static async Task<List<string>> GetConnectionsForUser(string userId)
        {
            if (onlineUsers.TryGetValue(userId, out var connection))
            {
                return await Task.FromResult(connection.Keys.ToList());
            }
            return await Task.FromResult(new List<string>());
        }
    }
}