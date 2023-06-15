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
  isFriend: boolean,
  isRequestSent: boolean,
  isRequestReceived: boolean,
}

type RequestFriendType = {
  senderId: string;
  receiverId: string;
}