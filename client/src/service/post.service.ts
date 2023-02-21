import { deleteMethodAPI, getMethodAPI, patchMethod, postMethodAPI } from "./base.service";

export const sendPost = async (post: FormData) => {
  const response = await postMethodAPI("/posts", post, true)
  return response
}

export const getFreePosts = async (page: number) => {
  const { data } = await getMethodAPI(`/posts?page=${page}&limit=5`)
  return data
}

export const getUserPosts = async (id: string, page: number) => {
  const { data } = await getMethodAPI(`/posts/${id}/posts?page=${page}&limit=5`)
  return data
}

export const likePost = async (id: string, userId: string) => {
  const response = await patchMethod(`/posts/${id}/like`, { userId })
  return response
}

export const deletePost = async (id: string) => {
  const response = await deleteMethodAPI(`/posts/${id}`)
  return response
}

export const updatePost = async (id: string, data: FormData) => {
  const response = await patchMethod(`/posts/${id}`, data, true)
  return response
}

export const addComment = async ({ postId, message, commentRoot }: { postId: string, message: string, commentRoot?: string }) => {
  const response = await postMethodAPI(`/posts/${postId}/comment`, { message, commentRoot })
  return response
}

export const getNotifications = async ({userId}:{userId:string}) => {
  const response = await getMethodAPI(`/posts/${userId}/notifications`)

  return response
}