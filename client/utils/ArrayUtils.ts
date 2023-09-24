import _, { List, ValueIteratee } from 'lodash';

export const groupByFirstLetter = (
  collection: List<any> | null | undefined,
  iteratee?: ValueIteratee<any>
) => {
  let list: any = _.map(
    _.entries(_.groupBy(collection, iteratee)),
    ([k, v]) => ({ [k]: v })
  );

  return list.map((item: any) => {
    return {
      name: Object.keys(item)[0],
      list: item[Object.keys(item)[0]],
    };
  });
};

export const flatMapObjectInfinite = (data: any): any[] =>
  data.pages.flatMap((page: any) => page.data.results);


export const formatListReactions = (data: ReactionType[]): ReactionCountType[] => {
  const reactionMap = new Map();
  data.forEach(reaction => {
    const reactionType = reaction.reactionType;
    const user = {
      _id: reaction.user._id,
      name: `${reaction.user.firstName} ${reaction.user.lastName}`
    }
  
    if (reactionMap.has(reactionType)) {
      const existingInfo = reactionMap.get(reactionType);
      existingInfo.count++;
      existingInfo.users.push(user);
    } else {
      reactionMap.set(reactionType, { type: reactionType, count: 1, users: [user] });
    }
  });
  return Array.from(reactionMap.values());
}