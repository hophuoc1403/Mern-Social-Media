import { getMethodAPI, patchMethod, postMethodAPI } from "./base.service";

export const getUser = async (id: number) => {
  const response = await getMethodAPI(`/users/${id}`);
  return response;
};

export const getSelfInfo = async () => {
  const response = await getMethodAPI("/users/self-info");
  return response;
};

export const getFriends = async (id: number) => {
  const response = await getMethodAPI(`/users/friends/${id}`);
  return response;
};

export const addOrRemoveFriend = async (id: number, friendId: number) => {
  const response = await postMethodAPI(`/users/add-friend/`, {
    userId: id,
    friendId,
  });
  return response;
};

export const changeAvatar = async (form: FormData) => {
  const response = await patchMethod(`/users/avatar`, form);
  return response;
};

export const editProfile = async (payload: {
  firstName: string;
  lastName: string;
  location: string;
  occupation: string;
}) => {
  const response = await patchMethod(`/users/update`, payload);
  return response;
};
