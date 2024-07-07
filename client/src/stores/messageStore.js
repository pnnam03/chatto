import { create } from "zustand";

const useMessageStore = create((set) => ( {
  msgs: [],
  setMsgs: (msgs) => set({msgs: msgs}),
}))

export default useMessageStore;