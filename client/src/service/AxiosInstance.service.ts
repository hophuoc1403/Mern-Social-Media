import axios from "axios";
import jwt_decode, { JwtPayload } from "jwt-decode";
import dayjs from "dayjs";

export const API_BASE_URL = "http://localhost:3001/api";

let access_token: any;
let refresh_token: any;
if (typeof window !== "undefined") {
  access_token = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;
  refresh_token = localStorage.getItem("refreshToken")
    ? localStorage.getItem("refreshToken")
    : null;
}

const handleRefreshToken = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken: refresh_token,
  });
  localStorage.setItem("accessToken", response.data.accessToken);
  return response;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${access_token}` },
});

// @ts-ignore
axiosInstance.interceptors.request.use(async (config) => {
  let _config = config;
  access_token = localStorage.getItem("accessToken");
  refresh_token = localStorage.getItem("refreshToken");

  if (refresh_token) {
    const user: JwtPayload = jwt_decode(refresh_token);

    const isExpiredRefresh = dayjs.unix(user.exp as number).diff(dayjs()) < 1;
    if (isExpiredRefresh) {
      alert("Out of login version, please login again");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/account/login";
    }
  }

  if (!access_token) {
    return _config;
  }
  const user: JwtPayload = jwt_decode(access_token);
  const isExpired = dayjs.unix(user.exp as number).diff(dayjs()) < 1;

  if (!isExpired) {
    return {
      ..._config,
      headers: {
        ..._config.headers,
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    const response = await handleRefreshToken();
    if (response) {
      console.log("da refresh token");
      // @ts-ignore
      config.headers.Authorization = `Bearer ${response?.data.accessToken}`;
    }

    return {
      ..._config,
      headers: {
        ..._config.headers,
        Authorization: `Bearer ${response?.data.accessToken}`,
      },
    };
  }
});

axiosInstance.interceptors.response.use(
  async (res) => res,
  async (err) => {
    if (err.toJSON) {
      if (err["toJSON"].message === "Network Error") {
        console.log("we don't have token bae :(((");
        window.location.href = "/account/login";
        // window.location.replace("/error-2");
        return;
      }
      const { status } = err.response;
      console.log(status);
      if (status == 401) {
        console.log("err 401");
      }
      // showNotification("error", data?.error ?? "");
      return Promise.reject(err);
    } else {
      console.log(err);
    }
  }
);

export default axiosInstance;
