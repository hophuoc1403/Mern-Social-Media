import {getMethodAPI, patchMethod} from "./base.service";

export const getUser =async () => {
  const response = await getMethodAPI(`/users/`)
  return response
}

export const getFriends = async () => {
  const response = await getMethodAPI(`/users/friends`)
  return response
}

export const addOrRemoveFriend = async  (id:string,friendId:string) => {
  const response = await patchMethod(`/users/${id}/${friendId}`)
  return response
}

export const changeAvatar = async (form:FormData) => {
  const response = await patchMethod(`/users/avatar`,form)
  return response
}

export const editProfile =async (payload:{firstName:string,lastName:string,location:string,occupation:string}) => {
  const response = await patchMethod(`/users`,payload)
  return response
}