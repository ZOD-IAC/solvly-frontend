import { GET, PUT, POST, DELETE_REQ } from "../../utils/api";

export const loginUser = async (body) => {
  const res = await POST("/user/api/login/", body);
  return res;
};

export const registerUser = async (body) => {
  const res = await POST("/user/api/register", body);
  return res;
};

export const logoutUser = async () => {
  const res = await POST("/user/api/logout");
  return res;
};

export const getQuestionSavedByUser = async (userId) => {
  const res = await GET(`/user/api/getusersaved/${userId}`);
  return res;
};

export const getUsersByRanking = async (sortby, page) => {
  const res = await GET(`/user/api/getusers/?sortby=${sortby}&page=${page}`);
  return res;
};
