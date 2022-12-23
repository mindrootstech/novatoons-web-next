// Check whether token is saved or not
const IsTokenSent = () => {
if (window !== "undefined"){ 
    const saved_token = localStorage.getItem("saved_token");
    if (saved_token === "true") return true
    return false
}
}

const removeFCMToken = () => window !== "undefined" && localStorage.removeItem("fcm_token")

// Checks fcm token and if exists returns it
const getFCMToken = () => {
    if (window !== "undefined") {
    const fcm_token = localStorage.getItem("fcm_token");
    if (fcm_token !== "" && fcm_token?.length > 10) return {
        status: true,
        token: fcm_token
    }
    return {
        status: false,
        token: fcm_token
    }
}
}
const runFbOrNot = "serviceWorker" in navigator



// Exports
export { IsTokenSent, getFCMToken, removeFCMToken, runFbOrNot }