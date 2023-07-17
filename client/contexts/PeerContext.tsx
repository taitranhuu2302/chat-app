import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import Peer, { MediaConnection } from 'peerjs';
import eventBus from "@/config/EventBus";

export type PeerContextType = {
  peerId: string
  peer: Peer | null;
  getUserMedia: (constraints?: MediaStreamConstraints | undefined) => Promise<MediaStream>;
}

export const PeerContext = createContext<null | PeerContextType>(null)

export const usePeerContext = () => useContext(PeerContext) as PeerContextType;

const PeerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [peerId, setPeerId] = useState("")
  const peerInstance = useRef<Peer | null>(null);
  const [mediaConfig, setMediaConfig] = useState({
    video: true,
    audio: false,
  })
  const getUserMedia = (constraints?: MediaStreamConstraints | undefined) => navigator.mediaDevices.getUserMedia({
    ...mediaConfig,
    ...constraints
  });
  const { auth } = useAuthContext()

  useEffect(() => {
    if (!auth) return;
    const peer = new Peer(auth._id, {
      host: 'localhost',
      port: 9000,
      path: "/",
    });

    peer.on('open', (id: string) => {
      setPeerId(id)
    })

    peerInstance.current = peer;
  }, [auth])

  return (
    <PeerContext.Provider value={{ peerId, peer: peerInstance.current, getUserMedia }}>
      {children}
    </PeerContext.Provider>
  )
}

export default PeerProvider;