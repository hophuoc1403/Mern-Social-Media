import { createStore } from "zustand";

interface chat {
  senderInfor: IUser;
  message: string;
  createdAt: string;
}

interface stateChat {
  chatList: chat[];
}

const useChatStore = createStore()((set) => ({}));
