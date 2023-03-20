import state from 'state'
import { create } from 'zustand'
import {createJSONStorage, persist} from "zustand/middleware";

interface profileState {
    isOpenEditModal: boolean,
    handleOpenModal: () => void
    handleCloseModal: () => void
    userSelected : IUser | null
    setUserSelected : (userSelected : IUser) => void
}

const useProfileStore = create<profileState>()(persist((set) => ({
    isOpenEditModal: false,
    handleOpenModal: () => { set({ isOpenEditModal: true }) },
    handleCloseModal: () => { set({ isOpenEditModal: false }) },
    userSelected:null,
    setUserSelected:(userSelected) => set({userSelected})
}),{
    name: 'food-storage', // unique name
    storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
}))

export default useProfileStore

