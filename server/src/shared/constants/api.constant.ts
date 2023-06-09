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
  },
};
