import state from 'state'
import { create } from 'zustand'

interface profileState {
    isOpenEditModal: boolean,
    handleOpenModal: () => void
    handleCloseModal: () => void
}

const useProfileStore = create<profileState>()((set) => ({
    isOpenEditModal: false,
    handleOpenModal: () => { set({ isOpenEditModal: true }) },
    handleCloseModal: () => { set({ isOpenEditModal: false }) }
}))

export default useProfileStore

