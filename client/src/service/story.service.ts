import {getMethodAPI, postMethodAPI} from "./base.service";

export const getStories = async () => {
  return (await getMethodAPI('/story')).data
}

export const addStory = async (payload:FormData) => {
  return (await postMethodAPI('/story',payload)).data
}