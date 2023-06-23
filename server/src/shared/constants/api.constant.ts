const PREFIX = '/api';

export const API = {
  AUTH: {
    INDEX: `${PREFIX}/auth`,
    LOGIN: `login`,
    REGISTER: `register`,
    GET_ME: `get-me`,
    GOOGLE_LOGIN: `google-login`,
  },
  USER: {
    INDEX: `${PREFIX}/users`,
    SEARCH: `search`,
    UPDATE: `update-information`,
    CHANGE_PASSWORD: `change-password`,
    CHANGE_AVATAR: `change-avatar`,
    GET_BY_ID: 'get-user-by-id/:id',
    GET_BY_EMAIL: 'get-user-by-email/:email',
    SEND_REQUEST_FRIEND: 'send-request-friend',
    CANCEL_REQUEST_FRIEND: 'cancel-request-friend',
    UN_FRIEND: 'un-friend',
    GET_REQUEST_FRIEND: 'get-request-friend/:id',
    GET_FRIEND: 'get-friend/:id',
    REJECT_REQUEST_FRIEND: 'reject-request-friend',
    ACCEPT_REQUEST_FRIEND: 'accept-request-friend',
    COUNT_REQUEST_FRIEND: 'count-request-friend',
  },
  NOTIFY: {
    INDEX: `${PREFIX}/notify`,
  },
  CONVERSATION: {
    INDEX: `${PREFIX}/conversation`,
    FIND_ALL_BY_USER: `find-all-by-user`,
    CREATE: `create`,
    UPDATE: `update/:id`,
    FIND_BY_ID: `get/:id`,
    CHANGE_AVATAR: `change-avatar/:id`,
    ADD_MEMBER: `add-member`,
    REMOVE_MEMBER: `remove-member`,
  },
  MESSAGE: {
    INDEX: `${PREFIX}/message`,
    FIND_ALL_BY_CONVERSATION: `find-all-by-conversation/:conversationId`,
    CREATE: `create`,
    UPDATE: `update/:id`,
    MESSAGE_RECALL: `message-recall/:id`,
  },
};
