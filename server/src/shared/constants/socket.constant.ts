export const SOCKET_EVENT = {
  USER_CONNECTED: 'USER_CONNECTED',
  USER_TYPING: "USER_TYPING",
  USER_IS_TYPING: "USER_IS_TYPING",
  VIDEO: {
    JOIN: "JOIN_CALL_VIDEO",
    CALLING: "VIDEO_CALLING",
  },
  USER: {
    SEND_REQUEST_FRIEND: 'SEND_REQUEST_FRIEND',
    UN_FRIEND: 'UN_FRIEND',
    ACCEPT_FRIEND_REQUEST: 'ACCEPT_FRIEND_REQUEST',
    REJECT_FRIEND_REQUEST: 'REJECT_FRIEND_REQUEST',
    CANCEL_FRIEND_REQUEST: 'CANCEL_FRIEND_REQUEST',
    COUNT_FRIEND_REQUEST: 'COUNT_FRIEND_REQUEST',
  },
  CONVERSATION: {
    CREATE_CONVERSATION: 'CREATE_CONVERSATION',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',
    ADD_MEMBER_CONVERSATION: 'ADD_MEMBER_CONVERSATION',
    REMOVE_MEMBER_CONVERSATION: 'REMOVE_MEMBER_CONVERSATION',
  },
  MESSAGE: {
    NEW_MESSAGE: 'NEW_MESSAGE',
    MESSAGE_RECALL: "MESSAGE_RECALL"
  },
};
