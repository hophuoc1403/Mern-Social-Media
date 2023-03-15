import { getMethodAPI } from "./base.service";

export const getTitleMessage = async () => {
  const response = await getMethodAPI("/chat/title");
  return response;
};
