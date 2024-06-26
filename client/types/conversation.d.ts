type ConversationEnum = 'PRIVATE' | 'GROUP';

type ConversationType = BaseType & {
  owner?: UserType;
  conversationName: string;
  avatar?: string;
  conversationType: ConversationEnum;
  members: UserType[];
  latestMessage: MessageType | null;
};

type ConversationCreate = {
  conversationName?: string;
  members: string[];
  conversationType: ConversationEnum;
};

type ConversationUpdate = {
  conversationName?: string;
}

type ConversationAddMember = {
  conversationId: string;
  members: string[]
}