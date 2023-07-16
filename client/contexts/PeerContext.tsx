import Peer from "peerjs";
import { PropsWithChildren, createContext, useEffect, useRef, useState } from "react";

export type PeerContextType = {
}

export const PeerContext = createContext<null | PeerContextType>(null)

const PeerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [peerId, setPeerId] = useState("")
  const peerInstance = useRef<Peer | null>(null);
  const getUserMedia = navigator.mediaDevices.getUserMedia;
  const [mediaConfig, setMediaConfig] = useState({
    video: true,
    audio: false,
  })

  useEffect(() => {
    const peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: "/",
    });

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peerInstance.current = peer;
  }, [])

  

  return (
    <PeerContext.Provider value={{  }}>
      {children}
    </PeerContext.Provider>
  )
}

export default PeerProvider;