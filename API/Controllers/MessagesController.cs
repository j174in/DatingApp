using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class MessagesController(IUnitOfWork uow) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await uow.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if (sender == null || recipient == null || sender.Id == createMessageDto.RecipientId)
                return BadRequest("Cannot create message");

            var message = new Message
            {
                Content = createMessageDto.Content,
                SenderId = sender.Id,
                RecipientId = recipient.Id
            };

            uow.MessageRepository.AddMessage(message);

            if (await uow.Complete()) return message.ToDto();

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResults<MessageDto>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();

            return await uow.MessageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok(await uow.MessageRepository.GetMessageThread(
                User.GetMemberId(), recipientId));
        }

        [HttpDelete("{messageid}")]
        public async Task<ActionResult> DeleteMessage(string messageid)
        {
            var memberId = User.GetMemberId();

            var message = await uow.MessageRepository.GetMessage(messageid);

            if (message == null) return BadRequest("Cannot delete this message");

            if (message.SenderId != memberId && message.RecipientId != memberId)
            {
                return BadRequest("You cannot delete this message");
            }

            if (message.SenderId == memberId) message.SenderDelete = true;
            if (message.RecipientId == memberId) message.ReceiverDelete = true;

            if (message is { SenderDelete: true, ReceiverDelete: true })
            {
                uow.MessageRepository.DeleteMessage(message);
            }

            if (await uow.Complete()) return Ok();

            return BadRequest("Problem deleting this message");
        }
    }

}