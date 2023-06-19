type UserType = {
  _id: string;
  email: string;
  bio: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar: string;
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
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
}

type UserChangePasswordType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string
}