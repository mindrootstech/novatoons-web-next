import axios from "axios";
import { base_url, isUserLoggedInToken } from "../config";

const api = axios.create({
    baseURL: base_url,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
});

export const axiosRequest = async (data) => {
    const res = await api.post(data.sub_url, data.dataMain)
    return res
}

api.interceptors.request.use(function (config) {
    // Do something before request is sent
    let admin_token = sessionStorage.getItem("admin_token");
    let loggedinBy = sessionStorage.getItem("loggedinBy");
    
    config.headers["token"] = isUserLoggedInToken()
    
    if(admin_token && loggedinBy === "admin") {
        config.headers["admin_token"] = admin_token
    }
    return config;
});

export default api;