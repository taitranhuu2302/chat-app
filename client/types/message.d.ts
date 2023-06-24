type MessageType = BaseType & {
  text?: string;
  reply?: MessageType;
  conversation: ConversationType;
  sender: UserType;
  messageType: 'DEFAULT' | 'NOTIFY';
  files: string[];
  isEdit?: boolean;
  dateRead?: string;
};
