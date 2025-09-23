
import Cookies from "js-cookie";
import axios from "axios";

const configMaker = (method, url, params = null, body = {}) => {
  // Dummy config for local dev
  return {
    method,
    url: `/api/${url}`,
    headers: {
      "Content-Type": "application/json",
    },
    ...(params && { params }),
    data: body,
  };
};

export const submitKitForm = async (data) => {
  // You should replace this with your actual API endpoint
  // For now, just simulate a successful response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, data: { message: "Success" } });
    }, 1000);
  });
};
