import { base_url, isUserLoggedInToken } from "./config"

export const postRequest = async ({ sub_url, dataMain }) => {

  let admin_token = sessionStorage.getItem("admin_token");
  let loggedinBy = sessionStorage.getItem("loggedinBy"); 

  let data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: isUserLoggedInToken(),
      Accept: 'application/json'
    },
    body: JSON.stringify(dataMain)
  }
  if(admin_token && loggedinBy === "admin") {
    data.headers.admin_token = admin_token
  }

  try {
    const response = await fetch(`${base_url}${sub_url}`, data)
    const res = await response.json()

    if(res.logout) {
      sessionStorage.clear()
      localStorage.clear()
  }
    if (res.status === true) {
      return res
    } else {
      return {
        status: res.status,
        message: res.message
      }
    }
  } catch (error) {
    return {
      statusCode : 500,
      status: false,
      message: "Server not responding. Please try again later"
    }
  }
}


