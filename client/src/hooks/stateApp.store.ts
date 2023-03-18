import { Socket } from "socket.io-client/build/esm/socket";
import state from "state";
import { create } from "zustand";
import { createStore } from '@udecode/zustood'

interface profileState {
  socket: Socket | null;
  isAppLoading: boolean;
  // setSocket: (socket: Socket) => void;
  // setIsAppLoading: () => void;

}

const useAppStore = createStore("app")<profileState> ({
  socket: null,
  isAppLoading: false,

}).extendActions((set, get, api) => ({
  setSocket: (socket: Socket) => {
    set.socket(socket) ;
  },
  setIsAppLoading: async () => {
      set.isAppLoading(true);
      await new Promise(_ => setTimeout(_,1300))
      set.isAppLoading(false);
    },
}));

export default useAppStore;
  // setSocket: (socket: Socket) => {
  //   set({ socket });
  // },
  // setIsAppLoading: async () => {
  //   set({ isAppLoading: true });
  //   await new Promise(_ => setTimeout(_,1300))
  //   set({ isAppLoading: false });
  // },
