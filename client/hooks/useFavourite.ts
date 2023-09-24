import { firebaseStore } from '@/config/Firebase';
import { FAVOURITE_DB } from '@/constants/Firebase';
import {
  setFavourite
} from '@/redux/features/MusicSlice';
import { useAppDispatch } from '@/redux/hooks';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@firebase/firestore';
import { useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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
        toast.success('The song has been added to favorites')
        return;
      }
      songSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      toast.success('The song has been removed from favorites')
    } catch (e) {
      console.log(e);
      toast.success('An error has occurred')
    }
  };

  return { getFavourite, onToggleFavourite };
};
