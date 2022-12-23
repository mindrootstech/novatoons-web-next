import React from 'react';
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import {resettypes, modelShow} from '../../redux/headerReducer'
import { isUserLoggedIn, isUserLoggedInToken, userData } from '../../config';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';
 
const HeroCarousel = props => {
    const data = props.data
    const router = useRouter()
    const dispatch = useDispatch()
    const HandleopenPopup = () => {
        if(!isUserLoggedIn() && !isUserLoggedInToken() && !userData()) {
           router.push('/login')
        } else {
            dispatch(resettypes())
            dispatch(modelShow(true))
        }
    }
    return (
        <div className="mainslider" >
            <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                scrollbar={{ draggable: true }}
            >
                {
                    data.map((item, index) => (
                        <SwiperSlide key={index} className={item.class}>
                            <div className="flat-title-page" style={{ backgroundImage: `url(${item.img.src})` }}>
                                <div className="swiper-container mainslider home">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <div className="slider-item">
                                                <div className="themesflat-container ">
                                                    <div className="wrap-heading flat-slider flex">
                                                        <div className="content">
                                                            <h2 className="heading">{item.title_1}</h2>
                                                            <h1 className="heading mb-style"><span className="tf-text s1">{item.title_2}</span>
                                                            </h1>
                                                            <h1 className="ml-3 heading">{item.title_3}</h1>
                                                            <p className="sub-heading">{item.description}
                                                            </p>
                                                            <div className="flat-bt-slider flex style2">
                                                                <Link href={`/explore`} className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Explore
                                                                </span></Link>
                                                                <div 
                                                                onClick={HandleopenPopup} 
                                                                className="cursorPointer sc-button header-slider style style-1 note fl-button pri-1"><span>Create
                                                                </span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                    ))
                }
            </Swiper>
        </div>
    );
}

HeroCarousel.propTypes = {
    data: PropTypes.array.isRequired,
    control: PropTypes.bool,
    auto: PropTypes.bool,
    timeOut: PropTypes.number
}

export default HeroCarousel;
