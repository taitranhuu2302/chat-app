type TokenType = {
  accessToken: string;
};

type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type LoginType = {
  email: string;
  password: string;
}