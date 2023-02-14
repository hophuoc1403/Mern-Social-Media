
import axiosInstance from './AxiosInstance.service';
import {API_BASE_URL} from "./AxiosInstance.service";

// get method

export const getMethodAPI = async (path: string, isFormData : boolean = false) => {
  const headers = isFormData ? { 'Content-type': 'multipart/form-data' } : { 'Content-type': 'application/json' };
  // @ts-ignore
  const response = await axiosInstance.get(`${API_BASE_URL}${path}`, headers);

  return response;
};

export const postMethodAPI = async (path: string, payload: any = {},isFormData : boolean = false) => {
  const headers = isFormData ? { 'Content-type': 'multipart/form-data' } : { 'Content-type': 'application/json' };
  // @ts-ignore
  const response = await axiosInstance.post(`${API_BASE_URL}${path}`, payload, headers);
  return response;
};

export const patchMethod = async (path: string, payload: any = {}, isFormData : boolean = false) => {
  // @ts-ignore

  const headers: any = isFormData ? { 'Content-type': 'multipart/form-data' } : { 'Content-type': 'application/json' };
  const response = await axiosInstance.patch(`${API_BASE_URL}${path}`, payload, headers);
  return response;
};

export const deleteMethodAPI = async (path: string, payload: any = {}, isFormData : boolean = false) => {
  const headers: any = isFormData ? { 'Content-type': 'multipart/form-data' } : { 'Content-type': 'application/json' };
  const response = await axiosInstance.delete(`${API_BASE_URL}${path}`, headers);
  return response;
};
