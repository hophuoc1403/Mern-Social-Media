import { getMethodAPI, postMethodAPI } from "./base.service";

export const getTitleMessage = async () => {
  const response = await getMethodAPI("/chat/title");
  return response;
};

export const getMessages = async (payload: { members: string[] }) => {
  const response = await postMethodAPI("/chat/get-message", payload);
  return response;
};
