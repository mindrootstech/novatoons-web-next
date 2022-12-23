import React, { useEffect, useState, Fragment } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
import { ratingShow } from '../../redux/modelReducer'

//third-party
import { toast } from 'react-toastify'
import { Rating } from 'react-simple-star-rating'
import { isWindow } from '../../utils/window';
import Link from 'next/link';

//redux
import { getFavoriteList } from '../../redux/userReducer'
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../../commonApi';

function SuccessToast({ message }) {
    return (
        <Fragment>
            <div className='toastify-header'>
                <div className='title-wrapper'>
                    <h6 className='toast-title'>{message}</h6>
                </div>
            </div>
        </Fragment>
    )
}

const FavoriteList = () => {
    const dummyuser = '/images/avatar/dummyuser.png'
    const [show, setShow]= useState(false)
    const [page, setPage] = useState(1)
    const [content_type, setContent_type] = useState('')
    const [keyword, setKeyword] = useState('')
    const dispatch = useDispatch()
    const { favoritesList, userData } = useSelector(state => state.userReducer)

    useEffect(() => {
        dispatch(getFavoriteList({
            content_type:'1',
            page
        }))
    }, [dispatch])

//fake 


    const [dataFilter] = useState(
        [
            {
                icon: 'icon-fl-sort-filled',
                name: 'Comic'
            },
            {
                icon: 'icon-fl-heart-filled',
                name: 'Art'
            }
        ]
    )

    const handleFilter = (index) => {
        setPage(1)
        setKeyword("")
        setContent_type(index + 1)
        dispatch(getFavoriteList({
            content_type: index + 1,
            page: 1
        }))
    }

    const handleSearch = (e) => {
        setKeyword(e.target.value)
        dispatch(getFavoriteList({
            content_type:'1',
            page,
            keyword: e.target.value
        }))
    }

    const handleLoadMore = () => {
        setPage(preState => preState + 1)
        dispatch(getFavoriteList({
            content_type:'1',
            page: page + 1
        }))
    }
useEffect(() => {
 setShow(true)
},[])
    const handleUnfavorite = async (item) => {
        let dataMain = {}
        if (item.type === "series") {
            dataMain.series_id = item.id
        } else if (item.type === "content") {
            dataMain.content_id = item.id
        }
        const response = await postRequest({ sub_url: '/favouritepost', dataMain })
        if (response.status === true) {
            dispatch(getFavoriteList({
                content_type: '1',
                page
            }))
            return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }
    // const navigate = useNavigate()
    const handleDetails = (item) => {
        if (item.type === "series") {
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/detail/${item.id}?type=1`)
        } else if (item.type === "content") {
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.id}?type=0`)
        }
    }
    const handleRating = (index, item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if(item.type === "series") {
            return toast.success(<SuccessToast message='You can only Rate the content of the particular Series.' />, { hideProgressBar: true,  autoClose:  8000, }) 
        }
        if(item.mine_rating !== "0" && item.mine_rating !== 0) {
            return toast.success(<SuccessToast message='Your have already rated this content' />, { hideProgressBar: true,  autoClose:  8000, })
        } 
    }
    return (isWindow() && show &&
        <>
            <section className="tf-activity favorites s1 tf-section">
                <div className="themesflat-container pt-80">
                    <div className="row mobileReverse">
                        <div className={favoritesList.data.length === 0 ? "col-lg-8 col-md-8 col-12 d-flex justify-content-center align-items-center" : "col-lg-8 col-md-8 col-12"}>
                            {favoritesList.data.length === 0 ? <Fragment>
                                <div className='dataNotFound'>
                                    <h2 className='dataNotFoundHeading text-center'>No Favourites Yet!</h2>
                                </div>
                            </Fragment> :
                                favoritesList.data.map((item, index) => (
                                    <div className="sc-card-activity style1 sc_card" key={index}>
                                        <div className="content">
                                            <div className="media">
                                                <div onClick={() => handleUnfavorite(item)} className={`dt-none cursorPointer button-active icon icon-4`}></div>
                                                <img src={item.cover_image} alt="novatoons" />
                                            </div>
                                            <div className="infor">
                                                <h3>
                                                    <Link className='cursorPointer' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/detail/${item.slug}`}> {item.title}  
                                                    {window.innerWidth > 576 ?
                                                            <span className='batch searchBatch ml-4'>{item.genre_name}</span>
                                                              : '' }
                                                            </Link>
                                                    </h3>
                                                    {window.innerWidth < 576 ?
                                                    <div className="CardGenre mb-3">
                                                        <p>{item.genre_name}</p>
                                                    </div> : ''}
                                                    {window.innerWidth > 576 ? 
                                                    <>
                                                    <div className="my-3 myuploadsRating cursorPointer" onClick={(e) => handleRating(index, item)}>
                                                                <Fragment>
                                                                <Rating
                                                                    ratingValue={(parseInt(item.total_rating) * 100) / 5}
                                                                    allowHalfIcon={true}
                                                                    fillColor="#ffd700"
                                                                    emptyColor="#808080"
                                                                    iconsCount={5}
                                                                    size={20}
                                                                    readonly={true}
                                                                /> </Fragment>
                                                        {/* <p className='ml-4'>{item.mine_rating !== 0 ? `Your Rating ${item.mine_rating}` : 'You have not rated yet. Rate Now.'}</p> */}
                                                    </div>
                                                    <div className="authorDetails mylib">
                                                        <div className='userImage'>
                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${item?.user_id}`}>
                                                            <img className="authorImage" alt='author' src={!item.profile_img || item.profile_img === "" ? dummyuser : item.profile_img} />
                                                        </Link>
                                                        </div>
                                                        <div className='UserDetails'>
                                                            <div className='authorHeading'>Author</div>
                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${item?.user_id}`}>
                                                            <span className="author authorName authorname_2">{(item.user_name !== "" && item.is_creator === 1) ? item.user_name : item.first_name + ' ' + item.last_name}</span>
                                                      </Link>
                                                        </div>
                                                    </div>
                                                     </> 
                                                    : <> 
                                                    <div className="meta-info-lib">
                                                    <div className="authorDetails mylib">
                                                    <div className='userImage'>
                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${item?.user_id}`}>
                                                        <img className="authorImage" alt='author' src={!item.profile_img || item.profile_img === "" ? dummyuser : item.profile_img} />
                                                    </Link>
                                                    </div>
                                                    <div className='UserDetails'>
                                                        <div className='authorHeading'>Author</div>
                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${item?.user_id}`}>
                                                        <span className="author authorName authorname_2">{(item.user_name !== "" && item.is_creator === 1) ? item.user_name : item.first_name + ' ' + item.last_name}</span>
                                                  </Link>
                                                    </div>
                                                </div>
                                                <div className="my-3 myuploadsRating cursorPointer" onClick={(e) => handleRating(index, item)}>
                                                <Fragment>
                                                <div className='authorHeading'>Rating</div>
                                                {window.innerWidth < 480 && <div className="ratingNumber d-flex rating_2 rating_st text_size icon_size">
                                                                    <i className="fa fa-star colorYellow"></i><span>{item.total_rating}</span>
                                                                </div>} </Fragment>
                                        {/* <p className='ml-4'>{item.mine_rating !== 0 ? `Your Rating ${item.mine_rating}` : 'You have not rated yet. Rate Now.'}</p> */}
                                    </div>
                                    </div>
                                    </> }
                                            </div>
                                        </div>
                                        <div onClick={() => handleUnfavorite(item)} className={`mobile_none cursorPointer button-active icon icon-4`}></div>
                                    </div>
                                ))
                            }
                            {
                                favoritesList.load_more &&
                                <div className="col-md-12 wrap-inner load-more text-center">
                                    <div id="load-more" className="sc-button loadmore fl-button pri-3 mt-10 cursorPointer" onClick={handleLoadMore}><span>Load More</span></div>
                                </div>
                            }
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">

                            <div id="side-bar" className="side-bar style-2">

                                <div className="widget widget-search mgbt-24">
                                    <input type="text" value={keyword} onChange={(e) => handleSearch(e)} className='text-white' placeholder="Search here" required />
                                </div>

                                <div className="widget widget-filter style-2 mgbt-0">
                                    {/* <h3 className="title-widget">Select Content Type</h3>
                                    <ul className="box-check">
                                        {
                                            dataFilter.map((item, index) => (
                                                <li key={index}><div onClick={() => handleFilter(index)} className={(content_type === (index + 1)) ? "cursorPointer box-widget-filter customFilter activeFilter" : "cursorPointer box-widget-filter customFilter"}>{item.name}</div></li>
                                            ))
                                        }

                                    </ul> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FavoriteList;
