import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useMessageStore from "../../stores/messageStore.js";
import useUserStore from "../../stores/userStore.js";
import AddMember from "../AddMember/AddMember.jsx";
import "./detail.css";

const Detail = () => {
  const { msgs } = useMessageStore();
  const { reset } = useUserStore();
  const { currentChannel } = useChannelStore();
  const [addMode, setAddMode] = useState(false);
  const [isOpen, setIsOpen] = useState({
    isMembersOpen: false,
    isFilesOpen: false,
  });

  // const handleBlock = async () => {
  //   if (!user) return;

  //   const userDocRef = doc(db, "users", currentUser.id);

  //   try {
  //     await updateDoc(userDocRef, {
  //       blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
  //     });
  //     changeBlock();
  //   } catch (err) {
  //     toast.error(err, toastOptions);
  //   }
  // };

  // useEffect(() => {
  //   console.log(msgs);
  // }, [msgs]);

  useEffect(() => {
    console.log(currentChannel?.members);
  }, [currentChannel])
  
  return (
    <div className="detail">
      <div
        style={{ borderBottom: "1px solid #dddddd35", padding: "20px 10px" }}
      >
        <h2>Detail</h2>
      </div>
      <div className="members">
        <div
          className="base"
          onClick={() => {
            setIsOpen({ ...isOpen, isMembersOpen: !isOpen.isMembersOpen });
          }}
        >
          <h4>Members</h4>
          <img
            className="dropdown-btn"
            src={isOpen.isMembersOpen ? "./arrowDown.png" : "./arrowUp.png"}
          />
        </div>
        {isOpen.isMembersOpen ? (
          <>
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

            <div
              className="user-info"
              onClick={() => setAddMode((prev) => !prev)}
            >
              <img src={addMode ? "./minus.png" : "./plus.png"} />
              Add member
            </div>
          </>
        ) : null}
      </div>

      <div className="files">
        <div
          className="base"
          onClick={() => {
            setIsOpen({ ...isOpen, isFilesOpen: !isOpen.isFilesOpen });
          }}
        >
          <h4>Files</h4>
          <img
            className="dropdown-btn"
            src={isOpen.isFilesOpen ? "./arrowDown.png" : "./arrowUp.png"}
          />
        </div>
        {isOpen.isFilesOpen ? (
          <>
            {msgs
              ?.filter((msg) => msg.type === "file")
              .map((msg, index) => {
                return (
                  <div className="file-card" key={index}>
                    <img
                      src={`http://localhost:3000/api/v1/media/${msg.file.id}`}
                    />
                    <div className="file-info">
                      <p className="file-name">{msg.file.fileName}</p>
                      <p className="file-extension">{msg.file.extension.slice(1).toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
          </>
        ) : null}
      </div>

      <button
        className="logout"
        onClick={() => {
          reset();
        }}
      >
        Sign Out
      </button>
      {addMode && <AddMember />}
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
