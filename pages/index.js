import Head from "next/head";

//components
import HeroCarousel from "../component/Carousel/HeroCarousel";
import LatestContent from "../component/HomeComponent/LatestContent"
import ServiceCards from "../component/HomeComponent/ServiceCards";

import React, { Fragment, useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { isUserLoggedIn } from '../config';
import { toast } from "react-toastify";
// import heroSliderData from '../assets/fake-data/data-slider-3';
// import Create from '../components/layouts/home-2/Create';
// import FeaturedContent from '../components/layouts/home-3/FeaturedContent';
// import Slider from '../components/slider/Slider';
// import YouMayLike from '../components/layouts/home-3/YouMayLike';
// import RejectionHandler from '../components/ErrorHandler/RejectionHandler';
// import VerifyModel from '../components/model/verifyDelayModel';

//ads
// import AdSense from '../services/adsense';
// import TestAds from '../services/testads';

// import Loader from '../components/loader/loader';

import { useDispatch, useSelector } from 'react-redux';
import { resetSeries, resetPage } from '../redux/ContentSeriesReducer'
import { getHomeData, getYoumaylikeData } from '../redux/homeReducer';
import { getUser, verifyUser } from '../redux/userReducer';
import { verifyUserShow } from '../redux/modelReducer';
import {isWindow} from '../utils/window'

//images
import img1 from '../public/images/item-background/bg1.png'
import img2 from '../public/images/item-background/bg2.png'
import img3 from '../public/images/item-background/mb.jpg'
import img4 from '../public/images/item-background/slidermobile.jpg'

const fakedata = [
  {
      title_1: "Discover, and collect",
      title_2: "extraordinary ",
      title_3: "Content",
      description: "Marketplace for collection of content",
      class:'center',
      img: img1
  },
  {
      title_1: "Discover, and collect",
      title_2: "extraordinary ",
      title_3: "Content",
      description: "Marketplace for collection of content",
      class:'center',
      img: img2
  }
]

export default function Home() {
//   const [searchParams ] = useSearchParams()
  const [reloginUser, setReloginUser] = useState(false)
  const { feature_content, 
      like_content,
      err, 
      err_message, 
      loading 
  } = useSelector(state => state.homeReducer)

  const { verifyUserModel } = useSelector(state => state.modelReducer)

  const { userData } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const token = isWindow() && sessionStorage.getItem('token')
  useEffect(() => {
      dispatch(
          resetSeries()
      )
      dispatch(
          resetPage(true)
      )
      dispatch(getHomeData())

      dispatch(getYoumaylikeData({
          page: 1
      }))

      if(userData.is_verified === "0") {
          dispatch(
              verifyUserShow(true)
          )
          setReloginUser(true)

      }else {
          dispatch(
              verifyUserShow(false)
          )

      }

      if(Object.keys(userData).length === 0 && isUserLoggedIn()) {
          dispatch(
              getUser()
          )
      }

  }, [dispatch])

  

//   useEffect(()=>{
//       if((searchParams.get('token') && searchParams.get('token') !== "") && (searchParams.get('01user_tkn') && searchParams.get('01user_tkn') !== "")) {
//           const userToken = searchParams.get('01user_tkn')
//           sessionStorage.setItem('token', JSON.stringify(userToken))
//           // setReloginUser(true)
//           dispatch(
//               verifyUser({
//                   token: searchParams.get('token')
//               })
//           )
//       }
//   }, [searchParams.get('token'), searchParams.get('01user_tkn')])
 
//   useEffect(()=>{
//       if(userData.is_verified === "0") {
//           dispatch(
//               verifyUserShow(true)
//           )
//       } 
//   }, [userData])
 
  useEffect(() => {
      if(token) {
          dispatch(
              getUser()
          )   

      }
      if(userData.newverify === true) {
      toast.success(<SuccessToast message={'Your account has been verified Successfully'} />, { hideProgressBar: true,  autoClose:  8000, })

      }

  }, [token])

 
  return (
    <>
          <Head>
            <title>Novatoons - A Book Reading Platform</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <HeroCarousel data={fakedata}/>
          <LatestContent/>
          <ServiceCards/>

    </>
  );
}
