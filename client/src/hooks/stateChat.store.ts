import { create } from "zustand";

interface chat {
  message: string;
  createdAt: string;
}

interface stateChatStore {
  senderInfor: string | null;
  isOpenChat: boolean;
  setSenderInfor: (senderInfor: string) => void;
  setIsOpenChat: () => void;
}

const useChatStore = create<stateChatStore>((set, get) => ({
  senderInfor: null,
  isOpenChat: false,
  setSenderInfor: (senderInfor: string) => {
    set({ senderInfor });
  },
  setIsOpenChat: () => {
    set({ isOpenChat: !get().isOpenChat });
  },
}));
export default useChatStore;
