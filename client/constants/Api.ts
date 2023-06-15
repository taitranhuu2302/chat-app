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
    GET_REQUEST_FRIEND: `/users/get-request-friend/:id`,
    GET_FRIEND: `/users/get-friend/:id`,
    REJECT_REQUEST_FRIEND: `/users/reject-request-friend`,
    ACCEPT_REQUEST_FRIEND: `/users/accept-request-friend`,
  },
};
