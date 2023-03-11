import { Socket } from "socket.io-client/build/esm/socket";
import state from "state";
import { create } from "zustand";

interface profileState {
  socket: Socket | null;
  isAppLoading: boolean;
  setSocket: (socket: Socket) => void;
  setIsAppLoading: () => void;

}

const useAppStore = create<profileState>()((set) => ({
  socket: null,
  isAppLoading: false,
  setSocket: (socket: Socket) => {
    set({ socket });
  },
  setIsAppLoading: async () => {
    set({ isAppLoading: true });
    await new Promise(_ => setTimeout(_,1300))
    set({ isAppLoading: false });
  },
}));

export default useAppStore;
