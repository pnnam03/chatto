import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import { socket } from "../socketio.jsx";
import "./Call.css";

const Video = (props) => {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      console.log({ ref: ref.current });
      ref.current.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} width="300px" />;
};

const Call = () => {
  const { channelName, participantId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [joinedCall, setJoinedCall] = useState(false);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const [participantName, setParticipantName] = useState(participantId);
  const [roomName, setRoomName] = useState(channelName);
  const userVideo = useRef();

  useEffect(() => {
    const initMediaStream = async () => {
      try {
        const stream = await navigator.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        socket.on("user-joined", handleUserJoined);
        socket.on("initiator-signal", handleInitiatorSignal);
        socket.on("receiver-signal", handleReceiverSignal);
      } catch (error) {
        console.error("Error accessing media devices: ", error);
      }
    };

    initMediaStream();
  }, []);

  useEffect(() => {
    if (localStream && userVideo.current) {
      userVideo.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleUserJoined = ({ userId, channelId }) => {
    console.log(`User ${userId} joined channel ${channelId}`);
    const peer = createInitiatorPeer(userId, socket.id, stream);
    setPeers((prevPeers) => [
      ...prevPeers,
      { remotePeerId: userId, peer },
    ]);
    peersRef.current.push({ remotePeerId: userId, peer });
  };

  const handleInitiatorSignal = ({ initiator, receiver, signal }) => {
    console.log("received initiator-signal");
    const peer = createReceiverPeer(receiver, initiator, signal, stream);
    setPeers((prevPeers) => [
      ...prevPeers,
      { remotePeerId: initiator, peer },
    ]);
    peersRef.current.push({ remotePeerId: initiator, peer });
  };

  const handleReceiverSignal = ({ receiver, initiator, signal }) => {
    console.log("received receiver-signal");
    const item = peersRef.current.find((p) => p.remotePeerId === receiver);
    if (item) {
      console.log("sent signal to receiver");
      item.peer.signal(signal);
    }
  };

  const createInitiatorPeer = (receiver, initiator, stream) => {
    console.log(`Creating peer from ${initiator} to ${receiver}`);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("initiator-signal to backend");
      socket.emit("initiator-signal", { initiator, receiver, signal });
    });

    peer.on("connect", () => {
      console.log("CONNECTED");
    });

    peer.on("close", () => {
      console.log("CLOSED");
      peersRef.current = peersRef.current.filter((p) => p.peer !== peer);
      setPeers((prevPeers) => prevPeers.filter((p) => p.peer !== peer));
      peer.destroy();
    });

    peer.on("error", (err) => {
      console.error(err);
    });
    return peer;
  };

  const createReceiverPeer = (receiver, initiator, incommingSignal, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.signal(incommingSignal);
    console.log("sent signal to initiator");

    peer.on("signal", (signal) => {
      console.log("receiver-signal to backend");
      socket.emit("receiver-signal", { receiver, initiator, signal });
    });

    peer.on("connect", () => {
      console.log("CONNECTED");
    });

    peer.on("error", (err) => {
      console.error(err);
    });

    peer.on("close", () => {
      console.log("CLOSED");
      peersRef.current = peersRef.current.filter((p) => p.peer !== peer);
      setPeers((prevPeers) => prevPeers.filter((p) => p.peer !== peer));
      peer.destroy();
    });

    return peer;
  };

  const joinCall = () => {
    console.log("Joining call:", roomName, participantName, socket.id);
    socket.emit("join-call", { userId: socket.id, channelId: roomName });
    setJoinedCall(true);
  };

  const leaveCall = () => {
    console.log("Leaving call");
    socket.emit("leave-call", { roomName });
    setPeers([]);
    setJoinedCall(false);
  };

  useEffect(() => {
    console.log({ peers });
  }, [peers]);
  
  return (
    <>
      {!joinedCall ? (
        <div id="join">
          <div id="join-dialog">
            <h2>Join a Video Room</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                joinCall();
              }}
            >
              <div>
                <label htmlFor="participant-name">Participant</label>
                <input
                  id="participant-name"
                  className="form-control"
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="room-name">Room</label>
                <input
                  id="room-name"
                  className="form-control"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-lg btn-success"
                type="submit"
                disabled={!roomName || !participantName || !localStream}
              >
                Join
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div id="room">
          <div id="room-header">
            <h2 id="room-title">{roomName}</h2>
            <button
              className="btn btn-danger"
              id="leave-room-button"
              onClick={leaveCall}
            >
              Leave Room
            </button>
          </div>
          <div id="layout-container">
            <div className="video-container">
              {localStream && (
                <video
                  playsInline
                  autoPlay
                  muted
                  ref={(video) => {
                    if (video) video.srcObject = localStream;
                    return video;
                  }}
                  width="300px"
                />
              )}
              <div className="user-name">{participantName} (You)</div>
            </div>
            {peersRef.current?.map((peer, index) => (
              <Video key={index} peer={peer.peer} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Call;
