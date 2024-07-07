import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Chat from "../components/Chat/Chat.jsx";
import ChatList from "../components/ChatList/ChatList.jsx";
import Detail from "../components/Detail/Detail.jsx";
import UserInfo from "../components/UserInfo/UserInfo.jsx";
import { SignInPath } from "../routes_path.jsx";
import { socket } from "../socketio.jsx";
import useChannelStore from "../stores/channelStore.js";
import useUserStore from "../stores/userStore.js";
import { toastOptions } from "../toastOptions.jsx";
const Main = () => {
  const { channels, fetchChannels, channelError, setCurrentChannel, currentChannel } =
    useChannelStore();
  const { user, userError } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    channelError ?? toast.error(channelError, toastOptions);
    userError ?? toast.error(userError, toastOptions);
  }, [channelError, userError]);

  useEffect(() => {
    !user && navigate(SignInPath);
    user && fetchChannels(user.accessToken);
    user &&
      socket.emit("add-online-user", {
        user: user.id,
      });
  }, [user]);

  useEffect(() => {
    channels?.map((channel) => {
      socket.emit("join-channel", channel);
    });
    if (channels?.length && !currentChannel)
      setCurrentChannel(channels[0]);
  }, [channels]);

  return (
    <div className="container">
      <div className="list">
        <UserInfo />
        <ChatList />
      </div>
      <Chat />
      <Detail />
    </div>
  );
};

export default Main;
