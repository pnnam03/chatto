import { Avatar } from "@mui/material";
import { useState } from "react";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useUserStore from "../../stores/userStore.js";
import "./addMember.css";
const AddMember = () => {
  const { currentChannel, fetchChannels, setCurrentChannel } = useChannelStore();
  const { user } = useUserStore();
  const [newMember, setNewMember] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    const response = await fetch(
      `http://localhost:3000/api/v1/users/search?email=${email}`
    );
    const responseData = await response.json();
    if (responseData) setNewMember(responseData);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const body = {
      members: [newMember],
    };
    console.log(currentChannel);
    const response = await fetch(
      `http://localhost:3000/api/v1/channels/${currentChannel.id}/add_members`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    const channelData = await response.json();
    setCurrentChannel(channelData)
    fetchChannels(user.accessToken);
    // socket.emit("msg-sent")
  };

  return (
    <div className="add-member">
      <h2 style={{padding: "10px"}}> Add a Member</h2>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Email" name="email" />
        <button>Search</button>
      </form>
      {newMember && (
        <div className="user">
          <div className="detail">
            <Avatar
              {...stringAvatar(
                `${newMember?.firstName} ${newMember?.lastName}`
              )}
            />
            <div>
              <h3>
                {newMember.firstName} {newMember.lastName}
              </h3>
              <span>{newMember?.email}</span>
            </div>
          </div>
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  );
};

export default AddMember;
