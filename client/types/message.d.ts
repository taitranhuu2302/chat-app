type MessageType = BaseType & {
  text?: string;
  reply?: MessageType;
  conversation: ConversationType | string;
  sender: UserType;
  messageType: 'DEFAULT' | 'NOTIFY';
  file: string;
  isEdit?: boolean;
  dateRead?: string;
  song?: string;
  reactions: ReactionType[]
};

type MessageCreateType = {
  text?: string;
  reply?: string;
  conversation: string;
  files?: any[];
  gifs?: string[];
  songs?: any[]
};