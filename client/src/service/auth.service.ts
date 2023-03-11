import { postMethodAPI } from "./base.service";

export const register = async (data: FormData) => {
  const response = await postMethodAPI("/auth/register", data, true);

  return response;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await postMethodAPI("/auth/login", { email, password });
  return response;
};

export const resetPassword = async (payload: {
  password: string;
  token: string;
}) => {
  const response = await postMethodAPI("/auth/reset-password", payload);
  return response;
};

export const verifyAccount = async (payload: { email: string }) => {
  const response = await postMethodAPI("/auth/email/send", payload);
};
