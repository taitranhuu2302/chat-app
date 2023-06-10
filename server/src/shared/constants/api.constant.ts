const PREFIX = '/api';

export const API = {
  AUTH: {
    INDEX: `${PREFIX}/auth`,
    LOGIN: `login`,
    REGISTER: `register`,
    GET_ME: `get-me`,
  },
  USER: {
    INDEX: `${PREFIX}/users`,
    UPDATE: `update-information`,
    CHANGE_PASSWORD: `change-password`,
    CHANGE_AVATAR: `change-avatar`,
    GET_BY_ID: 'get-user-by-id/:id',
    GET_BY_EMAIL: 'get-user-by-email/:email',
    SEND_REQUEST_FRIEND: 'send-request-friend',
    UN_FRIEND: 'un-friend',
    GET_REQUEST_FRIEND: 'get-request-friend/:id',
    GET_FRIEND: 'get-friend/:id',
    REJECT_REQUEST_FRIEND: 'reject-request-friend',
    ACCEPT_REQUEST_FRIEND: 'accept-request-friend',
  },
};
