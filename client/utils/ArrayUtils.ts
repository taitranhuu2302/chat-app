import _, { List, ValueIteratee } from 'lodash';

export const groupByFirstLetter = (collection: List<any> | null | undefined, iteratee?: ValueIteratee<any>) => {
  let list: any = _.map(_.entries(_.groupBy(collection, iteratee)), ([k, v]) => ({ [k]: v }));
  
  return list.map((item: any) => {
    return {
      name: Object.keys(item)[0],
      list: item[Object.keys(item)[0]],
    };
  });
};