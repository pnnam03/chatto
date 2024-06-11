import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { toast } from "react-toastify";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useUserStore from "../../stores/userStore.js";
import { toastOptions } from "../../toastOptions.jsx";
import "./detail.css";

const Detail = () => {
  const {reset} = useUserStore();
  const {currentChannel} = useChannelStore();
  const [isCurrentUserBlocked, a] = useState(false);
  const [isReceiverBlocked, b] = useState(false);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      toast.error(err, toastOptions);
    }
  };

  return (
    <div className="detail">
      <div style={{borderBottom: "1px solid #dddddd35", padding: "20px 10px"}}>
        <h2>Detail</h2>
      </div>
      <div className="members">
        <h3>Members</h3>
        {currentChannel?.members?.map((user, index) => {
          return (
              <div className="user-info" key={index}>
                <Avatar
                  {...stringAvatar(`${user?.firstName} ${user?.lastName}`)}
                />
                <p>
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
          );
        })}
      </div>
      <div className="files">
        <h3>Files</h3>
      </div>
      <button
          className="logout"
          onClick={() => {
            reset();
          }}
        >
          Sign Out
        </button>
      {/* <div className="photos">
        <div className="photoItem">
          <div className="photoDetail">
            <img
              src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
              alt=""
            />
            <span>photo_2024_2.png</span>
          </div>
          <img src="./download.png" alt="" className="icon" />
        </div>
      </div> */}
      {/* <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button
          className="logout"
          onClick={() => {
            handleSignOut();
          }}
        >
          Sign Out
        </button>
      </div> */}
    </div>
  );
};

export default Detail;
