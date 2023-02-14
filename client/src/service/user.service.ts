import {getMethodAPI, patchMethod} from "./base.service";

export const getUser =async (id:string) => {
  const response = await getMethodAPI(`/users/${id}`)
  return response
}

export const getFriends = async (id:string) => {
  const response = await getMethodAPI(`/users/${id}/friends`)
  return response
}

export const addOrRemoveFriend = async  (id:string,friendId:string) => {
  const response = await patchMethod(`/users/${id}/${friendId}`)
  return response
}