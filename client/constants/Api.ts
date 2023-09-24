const PREFIX = process.env.API_URL;

export const API = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    GET_ME: `/auth/get-me`,
    GOOGLE_LOGIN: `/auth/google-login`,
  },
  USER: {
    INDEX: `/users`,
    SEARCH: `/users/search`,
    UPDATE: `/users/update-information`,
    CHANGE_PASSWORD: `/users/change-password`,
    CHANGE_AVATAR: `/users/change-avatar`,
    GET_BY_ID: `/users/get-user-by-id/:id`,
    GET_BY_EMAIL: `/users/get-user-by-email/:email`,
    SEND_REQUEST_FRIEND: `/users/send-request-friend`,
    CANCEL_REQUEST_FRIEND: `/users/cancel-request-friend`,
    UN_FRIEND: `/users/un-friend`,
    GET_REQUEST_FRIEND: `/users/get-request-friend`, // /users/get-request-friend/:id
    GET_FRIEND: `/users/get-friend`, // /users/get-friend/:id
    REJECT_REQUEST_FRIEND: `/users/reject-request-friend`,
    ACCEPT_REQUEST_FRIEND: `/users/accept-request-friend`,
    COUNT_REQUEST_FRIEND: '/users/count-request-friend',
  },
  CONVERSATION: {
    INDEX: `/conversation`,
    FIND_ALL_BY_USER: `/conversation/find-all-by-user`,
    CREATE: `/conversation/create`,
    UPDATE: `/conversation/update`, // /conversation/update/:id
    FIND_BY_ID: `/conversation/get`, // /conversation/get/:id
    CHANGE_AVATAR: `/conversation/change-avatar`, // /conversation/change-avatar/:id
    ADD_MEMBER: `/conversation/add-member`,
    REMOVE_MEMBER: `/conversation/remove-member`,
    FIND_ALL_FILE: `/conversation/find-all-file`, // /conversation/find-all-file/:id
  },
  MESSAGE: {
    INDEX: `/message`,
    FIND_ALL_BY_CONVERSATION: `/message/find-all-by-conversation`, //`/message/find-all-by-conversation/:conversationId`
    CREATE: `/message/create`,
    UPDATE: `/message/update/:id`,
    MESSAGE_RECALL: `/message/message-recall`, ///message/message-recall/:id
  },
  PLAYLIST: {
    INDEX: `/playlist`,
    CREATE: `/playlist/create`,
    GET_BY_USER: `/playlist/get-by-user`,
    GET_BY_ID: `/playlist/get-by-id`, // /playlist/get-by-id/:id
    DELETE: `/playlist/delete`, // /playlist/delete/:id
    DELETE_SONG: (playlistId: string, songId: string) => `/playlist/delete/${playlistId}/song/${songId}`, // /playlist/delete/:playlistId/song/:songId
  },
  REACTIONS: {
    INDEX: `/reactions`,
    UPSERT: `/reactions/upsert`,
    UN_REACTION: `/reactions/un-reaction`, // /reactions/un-reaction/:messageId
  }
};
