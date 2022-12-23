import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { SessionProvider } from "next-auth/react"

//third-party
import nProgress from "nprogress";
//components
import Layout from '../component/Layout'

//css
import '../assets/css/globals.css'
import '../assets/css/theme.css'
import '../assets/css/shortcodes.css'
import '../assets/css/header.css'
import '../assets/css/carousel.css'
import '../assets/css/contact.css'
import '../assets/css/detailPage.css'
import '../assets/css/style.css'
import '../assets/css/style1.css'
import '../assets/css/style2.css'
import '../assets/css/dragable.css'
import '../assets/css/App.css'
import '../assets/css/content.css'
import '../assets/css/transaction.css'
import '../assets/css/error.css'
import '../assets/css/forums.css'
import '../assets/css/loader.css'
import '../assets/css/comments.css'
import '../assets/css/loader.scss'
import "react-toastify/dist/ReactToastify.css";
import 'react-tabs/style/react-tabs.css';



// import "../styles/globals.css";yyyyyy

//firebase functions
// import { runFbOrNot } from '../services/firebaseToken';
// import { getMyToken, onMessageListener } from "../services/firebase";

//redux
import { useSelector } from "react-redux";
// import { axiosRequest } from "../http";
import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom'
// import ScrollToTop from '../ScrollToTop';
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import Spinner from '../component/loader/spinner'

// ** Toast & ThemeColors Context
import { ToastContainer } from 'react-toastify'
// ** React Toastify
// import 'react-toastify/dist/ReactToastify.css';

//socket 
import { io } from "socket.io-client";
//css
// import "../App.css";



export default function App({ Component, pageProps }) {

  const [device_id, setDevice_id] = useState("")
  // const { userData } = useSelector((state) => state.userReducer);
  const [reconnect, setReconnect] = useState(0)
  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const options = {
  //     reconnectionDelay: 1000,
  //     reconnectionDelayMax: 5000,
  //     reconnectionAttempts: 15,
  //     transports: ["websocket", "polling"],
  //     upgrade: false,
  //     headers: {
  //       'Content-type': 'application/json',
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Headers': 'X-Requested-With',
  //       'Access-Control-Allow-Credentials': true
  //     },
  //   }
  //   setSocket(io(process.env.REACT_APP_SOCKET_SERVER_URL, options));
  // }, [io, reconnect]);

  // useEffect(() => {
  //   if (userData.id !== null && socket) {
  //     socket?.emit("newUser", userData?.id);

  //     socket?.emit("getactiveUsers", "hellow")

  //     socket?.on("disconnect", (err) => {
  //       console.log('disconnected', err)
  //       setReconnect(!reconnect)
  //     })

  //     socket.on("connect_error", (err) => {
  //       console.log(err.message)
  //     });

  //     socket.onerror = e => {
  //       console.log(e, "adasd")
  //     };

  //   }
  // }, [socket, userData]);

  //////////firsbase configuration start

  const handleUpdateDevice = async (device_id) => {
    try {
      const response = await axiosRequest({ sub_url: '/updatedeviceid', dataMain: { device_id, device_type: 0 } })
      if (response.status === 200) {
      }
    } catch (err) {
    }
  }

  // useEffect(() => {
  //   if (Object.keys(userData).length > 0 && runFbOrNot) {
  //     onMessageListener().then(payload => {
  //     }).catch(err => console.log('failed cause: ', err));
  //   }
  // }, [userData])

  // useEffect(() => {
  //   if (Object.keys(userData).length > 0) {
  //     getMyToken(setDevice_id)
  //   }
  // }, [userData])

  useEffect(() => {
    if (device_id !== "") {
      handleUpdateDevice(device_id)
    }
  }, [device_id])


  //////////firsbase configuration end

  // return (
  //   <Fragment>
  //     <HttpsRedirect>
  // <Component {...pageProps} />
  //     </HttpsRedirect>
  //   </Fragment>
  // );


  return (
    // <BrowserRouter >
    <SessionProvider>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          {/* <ScrollToTop /> */}
          <Layout>
            <Component {...pageProps} />

          </Layout>
        </Suspense>
      </Provider>
      <ToastContainer newestOnTop />

    </SessionProvider>
  )

}
