type ReactionType = {
  _id: string
  updatedAt: string
  createdAt: string
  user: UserType
  reactionType: string
}

type ReactionCreateType = {
  messageId: string,
  reactionType: string
}

type ReactionCountType = { users: {_id: string, name: string}[], count: number, type: string }