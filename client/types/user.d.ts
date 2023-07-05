type UserType = BaseType & {
  email: string;
  bio: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  isNoPassword: boolean;
  githubLink: string | null;
  facebookLink: string | null;
  currentUser?: CurrentUser;
};

type CurrentUser = {
  isFriend: boolean;
  isRequestSent: boolean;
  isRequestReceived: boolean;
};

type RequestFriendType = {
  senderId: string;
  receiverId: string;
};

type UserRequestFriendType = {
  _id: string;
  sender: UserType;
  receiver: string;
  createdAt: string;
  updatedAt: string;
};

type UserInformationType = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  address?: string;
  facebookLink?: string;
  githubLink?: string;
};

type UserChangePasswordType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};