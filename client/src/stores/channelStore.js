import { create } from "zustand";

const useChannelStore = create((set) => ({
  currentChannel: null,
  channels: [],
  channelError: null,
  fetchChannels: async (accessToken) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/my_channels`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData = await response.json();
      const channels = responseData.sort((a,b) => {
        if (!a.lastMessage)
          return -1;
        if (!b.lastMessage)
          return 1;

        const timeA = new Date(a.lastMessage.updatedAt);
        const timeB = new Date(b.lastMessage.updatedAt);
        return timeB - timeA;
      });
      
      set({
        channels: channels,
        channelError: null,
      });
    } catch (err) {
      set({ channelError: err.message });
    }
  },
  setChannels: (unsortedChannels) => {
    const channels = unsortedChannels.sort((a,b) => {
      if (!a.lastMessage)
        return -1;
      if (!b.lastMessage)
        return 1;
      const timeA = new Date(a.lastMessage.updatedAt);
      const timeB = new Date(b.lastMessage.updatedAt);
      return timeB - timeA;
    });
    
    set({
      channels: channels,
      channelError: null,
    });
  },
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
}));

export default useChannelStore;
