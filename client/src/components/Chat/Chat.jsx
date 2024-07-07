import { Avatar } from "@mui/material";
import { format, isToday } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import { upload } from "../../libs/uploader.jsx";
import { SignInPath } from "../../routes_path.jsx";
import { socket } from "../../socketio.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useMessageStore from "../../stores/messageStore.js";
import useUserStore from "../../stores/userStore.js";
import { toastOptions } from "../../toastOptions.jsx";
import AvatarGroup from "../AvatarGroup.jsx";
import "./chat.css";
const Chat = () => {
  const { setMsgs } = useMessageStore();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setMessage] = useState({
    text: "",
    type: "text",
    file: null,
  });
  const [incomingMessage, setIncomingMessage] = useState(null);
  const { currentChannel } = useChannelStore();
  const [open, setOpen] = useState(false);
  const [isCurrentUserBlocked, a] = useState(null);
  const [isReceiverBlocked, b] = useState(null);
  const { channels, setChannels } = useChannelStore();
  const { user } = useUserStore();

  const navigate = useNavigate();
  useEffect(() => {
    !user && navigate(SignInPath);
  }, [user]);

  useEffect(() => {
    currentChannel && fetchMessages();
  }, [currentChannel]);

  useEffect(() => {
    setMsgs(messages);
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/${currentChannel.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const responseData = await response.json();
      setMessages(responseData);
    } catch (err) {
      toast.error(err, toastOptions);
    }
  };

  // scroll to end of chat
  const endRef = useRef(null);
  useEffect(() => {
    const scrollToBottom = () => {
      if (endRef.current) {
        endRef.current.scrollTo({
          top: endRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    scrollToBottom();

    const handleImageLoad = () => {
      scrollToBottom();
    };

    const images = document.querySelectorAll(".center img");
    images.forEach((img) => {
      img.addEventListener("load", handleImageLoad);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, [messages]);

  const sendMessage = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/${currentChannel.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify(currentMessage),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const responseData = await response.json();
      socket.emit("msg-sent", responseData);
      setMessages([...messages, responseData]);
      setMessage({ text: "", type: "text", file: null });
      // update the channel with new message
      setChannels(
        channels.map((channel) =>
          channel.id === responseData.channelId
            ? { ...channel, lastMessage: responseData }
            : channel
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // handle incoming message from socket
  useEffect(() => {
    socket.on("msg-received", (data) => {
      setIncomingMessage(data);
    });
  }, []);

  useEffect(() => {
    if (incomingMessage !== null) {
      console.log(incomingMessage);
      if (incomingMessage.channelId == currentChannel.id) {
        // append the message to current channel message
        // update the channel with incoming message
        setMessages([...messages, incomingMessage]);
        setChannels(
          channels.map((channel) =>
            channel.id === incomingMessage.channelId
              ? { ...channel, hasNewMessage: false, lastMessage: incomingMessage }
              : channel
          )
        );
      }
      else {
        // notify received a message in different channel
        // update the channel with incoming message
        setChannels(
          channels.map((channel) =>
            channel.id === incomingMessage.channelId
              ? { ...channel, hasNewMessage: true, lastMessage: incomingMessage }
              : channel
          )
        );
      }
      // update the channel with new message
      setIncomingMessage(null);
    }
  }, [incomingMessage]);

  
  const handleSendMessage = () => {
    if (currentMessage?.type === "text" && currentMessage?.text === "") {
      return;
    }
    sendMessage();
  };

  const handleEmoji = (e) => {
    setMessage({ text: currentMessage.text + e.emoji, type: "text", file: "" });
    setOpen(false);
  };

  useEffect(() => {
    currentMessage.type === "file" && handleSendMessage();
  }, [currentMessage]);

  const handleImg = async (e) => {
    if (e.target.files[0]) {
      const imgRecord = await upload(e.target.files[0], user.accessToken);
      console.log(imgRecord);
      setMessage({
        ...currentMessage,
        file: imgRecord,
        type: imgRecord.type,
      });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <AvatarGroup channel={currentChannel} />
          <div className="texts">
            <span>{currentChannel?.name}</span>
            {/* <p>Lorem ipsum dolor, sit amet.</p> */}
          </div>
        </div>
      </div>
      <div className="center" ref={endRef}>
        {messages?.map((message, index) => (
          <div
            className={
              message?.sender?.id === user?.id ? "message own" : "message"
            }
            key={index}
          >
            {message?.sender?.id !== user?.id ? (
              <Avatar
                {...stringAvatar(
                  `${message?.sender?.firstName} ${message?.sender?.lastName}`
                )}
              />
            ) : null}

            <div className="texts">
              {message.type === "file" && (
                <img
                  src={`http://localhost:3000/api/v1/media/${message.file.id}`}
                  alt=""
                />
              )}
              {message.type === "text" && <p>{message.text}</p>}
              <span>
                {format(
                  new Date(message.updatedAt),
                  isToday(new Date(message.updatedAt)) ? "hh:mm" : "hh:mm dd/MM"
                )}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
            accept="image/*"
          />
          {/* <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" /> */}
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={currentMessage.text}
          onChange={(e) => {
            setMessage({ text: e.target.value, type: "text", file: null });
          }}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSendMessage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
