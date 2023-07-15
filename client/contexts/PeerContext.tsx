import Peer, { MediaConnection } from "peerjs";
import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";

export type PeerContextType = {
  call: MediaConnection | null,
  onCallVideo: (remoteId: string) => void;
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
  const { auth } = useContext(AuthContext) as AuthContextType
  const [call, setCall] = useState<MediaConnection | null>(null)

  useEffect(() => {
    if (!auth) return;
    const peer = new Peer(auth._id, {
      host: 'localhost',
      port: 9000,
      path: "/",
    });

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('call', async (call) => {
      if (window.confirm("Bạn có muốn chấp nhận cuộc gọi ?")) {
        console.log('Xin chao');
        // setCall(call)
        // const stream = await getUserMedia(CONSTRAINS);
        // const videoLocal = localVideoRef.current;
        // const videoRemote = remoteVideoRef.current;
        // if (!videoLocal || !videoRemote) return;
        // videoLocal.srcObject = stream;
        // videoLocal.play();

        // call.answer(stream);
        // call.on('stream', (remoteStream) => {
        //   videoRemote.srcObject = remoteStream;
        //   videoRemote.play();
        // });
      }
    });

    peerInstance.current = peer;
  }, [auth, call])

  const onCallVideo = async (remotePeerId: string) => {
    try {
      const peer = peerInstance.current;

      if (!peer) return;

      const stream = await getUserMedia(mediaConfig);

      // const videoLocal = localVideoRef.current;
      // const videoRemote = remoteVideoRef.current;

      // if (!videoLocal || !videoRemote) return;
      // videoLocal.srcObject = stream;
      // videoLocal.play();

      const call = peer.call(remotePeerId, stream);

      call.on('stream', (remoteStream) => {
        // videoRemote.srcObject = remoteStream;
        // videoRemote.play();
      });

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <PeerContext.Provider value={{ call, onCallVideo }}>
      {children}
    </PeerContext.Provider>
  )
}

export default PeerProvider;