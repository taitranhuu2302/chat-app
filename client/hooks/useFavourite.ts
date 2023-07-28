import { useCallback } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@firebase/firestore';
import { firebaseStore } from '@/config/Firebase';
import { FAVOURITE_DB } from '@/constants/Firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addFavourite,
  removeFavourite,
  setFavourite,
} from '@/redux/features/MusicSlice';

export const useFavourite = () => {
  const { auth } = useAuthContext();
  const favouriteRef = collection(firebaseStore, FAVOURITE_DB);
  const dispatch = useAppDispatch();

  const getFavourite = useCallback(() => {
    if (!auth) return;
    const q = query(favouriteRef, where('authId', '==', auth._id));

    return onSnapshot(q, (snapshot) => {
      const favourites: any[] = [];

      snapshot.forEach((doc) => {
        favourites.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      dispatch(setFavourite(favourites));
    });
  }, [auth]);

  const onToggleFavourite = async (data: SongInfoType) => {
    if (!auth) return;
    let payload = {
      authId: auth._id,
      song: data,
    };

    const q = query(favouriteRef, where('song.encodeId', '==', data.encodeId));
    const songSnapshot = await getDocs(q);
    const isCheck = songSnapshot.docs.map((doc) => ({ ...doc.data() }));

    try {
      if (!isCheck.length) {
        const { id } = await addDoc(favouriteRef, payload);
        dispatch(
          addFavourite({
            ...payload,
            id,
          })
        );
        return;
      }
      songSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      dispatch(removeFavourite(isCheck[0] as FavouriteType));
    } catch (e) {
      console.log(e);
    }
  };

  return { getFavourite, onToggleFavourite };
};
