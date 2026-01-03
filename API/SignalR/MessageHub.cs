using System.Text.RegularExpressions;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;

namespace API.SignalR
{
    public class MessageHub(IUnitOfWork uow, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public async override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request?.Query["userId"].ToString()
                ?? throw new HubException("Other user id is not present");
            var groupName = GetGroupName(GetUserId(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);

            var messages = await uow.MessageRepository.GetMessageThread(GetUserId(), otherUser);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);

        }

        public async Task SendMessage(CreateMessageDto messageDto)
        {
            var sender = await uow.MemberRepository.GetMemberByIdAsync(GetUserId());
            var recipient = await uow.MemberRepository.GetMemberByIdAsync(messageDto.RecipientId);

            if (sender == null || recipient == null || sender.Id == messageDto.RecipientId)
                throw new HubException("Bad Request");

            var message = new Message
            {
                Content = messageDto.Content,
                SenderId = sender.Id,
                RecipientId = recipient.Id
            };
            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await uow.MessageRepository.GetMessageGroup(groupName);
            var userInGroup = group != null && group.Connections.Any(x => x.UserId == message.RecipientId);
            if (userInGroup)
            {
                message.DateRead = DateTime.UtcNow;
            }

            uow.MessageRepository.AddMessage(message);

            if (await uow.Complete())
            {
                await Clients.Group(groupName).SendAsync("NewMessageSend", message.ToDto());
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);
                if (connections != null && connections.Count > 0 && !userInGroup)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message.ToDto());
                }
            }

        }

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            await uow.MessageRepository.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await uow.MessageRepository.GetMessageGroup(groupName);

            if (group == null)
            {
                group = new Entities.Group(groupName);
                uow.MessageRepository.AddGroup(group);
            }

            var connection = new Connection(Context.ConnectionId, GetUserId());
            group.Connections.Add(connection);

            return await uow.Complete();
        }

        private string GetGroupName(string caller, string otherUser)
        {
            return string.CompareOrdinal(caller, otherUser) > 0
                ? $"{caller}-{otherUser}" : $"{otherUser}-{caller}";
        }

        private string GetUserId()
        {
            return Context.User?.GetMemberId() ?? throw new HubException("Current user id is not present");
        }
    }
}