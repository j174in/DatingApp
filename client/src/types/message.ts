export type Message = {
  id: string;
  content: string;
  dateRead?: string;
  messageSend: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl: string;
  recipientId: string;
  recipientDisplayName: string;
  recipientImageUrl: string;
  currentUserSender?: boolean;
};
