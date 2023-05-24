import { getMethodAPI, postMethodAPI } from "./base.service";

export const getTitleMessage = async () => {
  const response = await getMethodAPI("/chat/title");
  return response;
};

export const getMessages = async (payload: { members: number[] }) => {
  const response = await postMethodAPI("/chats/get-message", payload);
  return response;
};
