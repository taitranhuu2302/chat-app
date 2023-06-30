type MessageType = BaseType & {
  text?: string;
  reply?: MessageType;
  conversation: ConversationType;
  sender: UserType;
  messageType: 'DEFAULT' | 'NOTIFY';
  file: string;
  isEdit?: boolean;
  dateRead?: string;
};

type MessageCreateType = {
  text?: string;
  reply?: string;
  conversation: string;
  files?: any[]
};