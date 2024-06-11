import { Avatar } from "@mui/material";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import useUserStore from "../../stores/userStore.js";
import "./userInfo.css";
const UserInfo = () => {
  const { user } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <Avatar {...stringAvatar(`${user?.firstName} ${user?.lastName}`)} />
        <h3>{user?.firstName} {user?.lastName}</h3>
      </div>
      {/* <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div> */}
    </div>
  );
};

export default UserInfo;
