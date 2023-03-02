import {getMethodAPI, patchMethod} from "./base.service";

export const getUser =async (id:string | null = null) => {
  const response = await getMethodAPI(`/users/${id ?? ''}`)
  console.log(response);
  
  return response
}

export const getFriends = async () => {
  const response = await getMethodAPI(`/users/fiends`)
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