// import { default as Avatar, default as AvatarGroup } from "@mui/material";
// import AvatarGroup from "@mui/material/AvatarGroup";
// import {format} from "timeago.js";
import { format, isToday } from "date-fns";
import { useState } from "react";
import { socket } from "../../socketio.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useUserStore from "../../stores/userStore.js";
import AddChannel from "../AddChannel/AddChannel.jsx";
import AvatarGroup from "../AvatarGroup.jsx";
import "./chatList.css";

const ChatList = () => {
  const { channels, currentChannel, setCurrentChannel } = useChannelStore();
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const { user } = useUserStore();
  // useEffect(() => {
  //   const unSub = onSnapshot(
  //     doc(db, "userchats", currentUser.id),
  //     async (res) => {
  //       const items = res.data().chats;

  //       const promises = items.map(async (item) => {
  //         const userDocRef = doc(db, "users", item.receiverId);
  //         const userDocSnap = await getDoc(userDocRef);

  //         const user = userDocSnap.data();

  //         return { ...item, user };
  //       });

  //       const chatData = await Promise.all(promises);

  //       setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
  //     }
  //   );

  //   return () => {
  //     unSub();
  //   };
  // }, [currentUser]);

  // const filteredChats = chats.filter((c) =>
  //   c.user.username.toLowerCase().includes(input.toLowerCase())
  // );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {channels.map((channel) => (
        <div
          className="item"
          key={channel.id}
          onClick={() => {
            socket.emit("leave-channel", currentChannel);
            socket.emit("join-channel", channel);
            setCurrentChannel(channel);
          }}
          style={{
            backgroundColor: channel === currentChannel ? "rgba(17, 25, 40, 0.75)" : "",
          }}
        >
          <AvatarGroup channel={channel} />

          {/* <GroupAvatar bigAvatarSrc={currentChannel.members.}/> */}
          <div className="texts">
            <span>
              {/* {channel.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username} */}
              {channel.name}
            </span>
            {channel.lastMessage ? (
              <div className="last-message">
                <p className="last-message-info">
                  {channel.lastMessage.sender?.firstName}:{" "}
                  {channel.lastMessage.type === "text" ? (
                    channel.lastMessage.data
                  ) : (
                    <>
                      Image
                      <img
                        src="./././public/img.png"
                        style={{ width: 20, height: 20 }}
                      />
                    </>
                  )}
                  {/* {channel.lastMessage.data} */}
                </p>
                <p className="last-message-time">
                  {format(
                    new Date(channel.lastMessage.updatedAt),
                    isToday(new Date(channel.lastMessage.updatedAt))
                      ? "HH:mm"
                      : "dd/MM"
                  )}
                                {/* {formatDistanceToNowStrict(new Date(channel.lastMessage.updatedAt))} */}

                </p>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      {addMode && <AddChannel />}
    </div>
  );
};

export default ChatList;
