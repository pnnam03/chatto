import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      userError: null,
      fetchUser: async (userData) => {
        set({ loading: true, userError: null });
        const body = JSON.stringify(userData);
        try {
          const response = await fetch(
            "http://localhost:3000/api/v1/auth/sign_in",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: body,
            }
          );
          const responseData = await response.json();
          if (responseData === null) throw new Error("Account not found!");
          if (responseData?.error)
            throw new Error(responseData?.message || "An error occured");
          set({ user: responseData, loading: false, userError: null });
        } catch (err) {
          set({ userError: err.message, loading: false });
        }
      },
      reset: () => set({ user: null, loading: false, userError: null }),
    }),
    {
      name: "user-storage", // unique name for the item in localStorage
      storage: createJSONStorage(() => localStorage), // specify localStorage
    }
  )
);

export default useUserStore;
