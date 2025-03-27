import axios from "axios";

const baseURL = "https://viby.onrender.com";
// const baseURL = "http://localhost:3000";

export const Axios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRequest = async (url) => {
  try {
    const response = await Axios.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const postRequest = async (url, data) => {
  try {
    const response = await Axios.post(url, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const postMultiPartRequest = async (url, data) => {
  try {
    const response = await Axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};
