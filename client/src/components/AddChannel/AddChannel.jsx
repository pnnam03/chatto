import { useState } from "react";
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
    const formData = new FormData(e.target);
    const channelName = formData.get("name");

    const body = {
      name: channelName,
      members: [user.id],
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
      <h2 style={{padding: "10px"}}>Create a Channel</h2>
      <form onSubmit={handleAdd}>
        <input type="text" placeholder="Channel Name" name="name" />
        <button>Create</button>
      </form>
    </div>
  );
};

export default AddChannel;
