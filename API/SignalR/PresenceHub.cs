using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class PresenceHub(PresenceTracker presenceTracker) : Hub
    {
        public async override Task OnConnectedAsync()
        {
            await presenceTracker.UserConnected(GetUserId(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserOnline", GetUserId());

            var currentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetUsersOnline", currentUsers);
        }

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            await presenceTracker.UserDiconected(GetUserId(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserOffline", GetUserId());

            var currentUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetUsersOnline", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }

        private string GetUserId()
        {
            return Context.User?.GetMemberId() ?? throw new HubException("Unable to get user");
        }


    }

}