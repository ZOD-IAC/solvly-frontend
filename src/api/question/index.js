import { GET, POST, PUT, DELETE_REQ } from "../../utils/api";

export const createQuestion = (body) => {
  const res = POST("/question/create-question", body);
  return res;
};

export const getQuestionTags = (body) => {
  const url = `/question/api/getTags/?name=${body}`;
  const res = GET(url);

  return res;
};

export const addQuestionTag = (body) => {
  const url = `/question/api/add-tags/`;
  const res = POST(url, { tag: body });

  return res;
};

export const getUserRecentQuestion = (user) => {
  const url = `/question/api/get-questionList?user=${user}&limit=2&sort=1`;
  const res = GET(url);

  return res;
};

export const getStatsData = async () => {
  const res = GET("/question/api/getStats/");
  return res;
};

export const saveQuestion = async (questionId) => {
  const url = `/question/api/${questionId}/save`;
  const res = POST(url);
  return res;
};

export const getQuestionDetail = async (questionId) => {
  const url = `/question/api/get-question/${questionId}`;
  const res = GET(url);

  return res;
};

export const getQuestionList = (params) => {
  const param = new URLSearchParams(params);
  const url = `/question/api/get-questionList?${param}`;
  const res = GET(url);

  return res;
};
