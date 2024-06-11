import { Avatar } from "@mui/material";
import { useState } from "react";
import { stringAvatar } from "../../libs/stringAvatar.jsx";
import useChannelStore from "../../stores/channelStore.js";
import useUserStore from "../../stores/userStore.js";
import "./addChannel.css";
const AddChannel = () => {
  const { fetchChannels, setCurrentChannel } = useChannelStore();
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
      name: "channel name",
      members: [user.id, newMember.id],
    };
    const response = await fetch(
      `http://localhost:3000/api/v1/channels`,
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
  };

  return (
    <div className="add-channel">
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

export default AddChannel;
