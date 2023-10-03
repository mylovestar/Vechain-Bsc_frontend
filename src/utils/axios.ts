import axios from "axios";

const Axios = axios.create({
  // baseURL: "https://mvgbridge.com/",
  baseURL: "http://localhost:5000/",
});

export default Axios;
