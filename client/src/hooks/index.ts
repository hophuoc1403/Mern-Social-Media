import useAppStore from "./stateApp.store";
import {mapValuesKey} from "@udecode/zustood";

const rootStore = {
  socket:useAppStore,
}

export const useStore = () => mapValuesKey("use",rootStore)

export const useTrackedStore = () => mapValuesKey("useTracked",rootStore)

export const storeState = () =>  mapValuesKey("get",rootStore)

export const actions =() => mapValuesKey("set",rootStore)