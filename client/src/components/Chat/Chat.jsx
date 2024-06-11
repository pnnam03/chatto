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
import useUserStore from "../../stores/userStore.js";
import { toastOptions } from "../../toastOptions.jsx";
import AvatarGroup from "../AvatarGroup.jsx";
import "./chat.css";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setMessage] = useState({ data: "", type: "text" });
  const { user } = useUserStore();
  const { currentChannel } = useChannelStore();
  const [open, setOpen] = useState(false);
  const [isCurrentUserBlocked, a] = useState(null);
  const [isReceiverBlocked, b] = useState(null);
  const { channels, setChannels } = useChannelStore();

  const navigate = useNavigate();
  useEffect(() => {
    !user && navigate(SignInPath);
  }, [user]);

  useEffect(() => {
    currentChannel && fetchMessages();
  }, [currentChannel]);

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
      setMessage({ data: "", type: "text" });
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

  useEffect(() => {
    socket.on("msg-received", (data) => {
      setMessages((msgs) => [...msgs, data]);
    });
  }, []);

  const handleSendMessage = () => {
    if (currentMessage?.data === "") {
      return;
    }

    // const body = {
    //   data: currentMessage.data,
    //   type: currentMessage.type,
    // };
    // setMessages([...messages, { ...body, sender: user }]);
    // setMessage({ data: "", type: "text" });

    // socket.emit("msg-sent", {
    //   sender: user,
    //   data: currentMessage.data,
    //   type: currentMessage.type,
    //   channel: currentChannel.id,
    // });
    sendMessage();
  };

  const handleEmoji = (e) => {
    setMessage({ data: currentMessage.data + e.emoji, type: "text" });
    setOpen(false);
  };

  useEffect(() => {
    currentMessage.type === "file" && handleSendMessage();
  }, [currentMessage]);

  const handleImg = async (e) => {
    if (e.target.files[0]) {
      const imgRecord = await upload(e.target.files[0], user.accessToken);
      setMessage({
        data: `http://localhost:3000/api/v1/media/${imgRecord.id}`,
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
              {message.type === "file" && <img src={message.data} alt="" />}
              {message.type === "text" && <p>{message.data}</p>}
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
          value={currentMessage.data}
          onChange={(e) => {
            setMessage({ data: e.target.value, type: "text" });
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
