export const EDITOR_FOCUS = "EDITOR_FOCUS"

export enum ReactionEnum {
	LIKE = "like",
	HEART= "heart",
	HAHA = "haha",
	WOW = "wow",
	SAD = "sad",
	ANGRY = "angry"
}
export const reactionIcons = [
	{
		name: ReactionEnum.HEART,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png"
	},
	{
		name: ReactionEnum.HAHA,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png"
	},
	{
		name: ReactionEnum.WOW,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png"
	},
	{
		name: ReactionEnum.SAD,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png"
	},
	{
		name: ReactionEnum.ANGRY,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/tc6/1/32/1f620.png"
	},
	{
		name: ReactionEnum.LIKE,
		icon: "https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png"
	},
]
