import Axios from "axios";
const axios = Axios.create({
  baseURL: "https://class.development.local/api/",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response?.status == 401 && window.location.pathname != "/login") {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);
export default axios;
