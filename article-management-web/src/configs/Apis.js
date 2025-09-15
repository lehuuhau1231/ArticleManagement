import axios from "axios";

const BASE_URL = "https://articlemanagement-7.onrender.com/";

export const endpoints = {
  login: "auth/token",
  user: "api/user",
  post: "api/posts",
  post_title: "api/posts/title",
};

export const authApis = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default axios.create({
  baseURL: BASE_URL,
});
