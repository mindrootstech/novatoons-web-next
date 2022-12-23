import React, { Fragment, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import {RatingModel} from '../../component/model';

//third party
import { Rating } from 'react-simple-star-rating'
import { Tab, Tabs, TabList } from 'react-tabs';
import { toast } from 'react-toastify'
import Link from 'next/link';
import { isWindow } from '../../utils/window';
// //redux
import { getLibrary } from '../../redux/userReducer'
import { ratingShow } from '../../redux/modelReducer'
import { useDispatch, useSelector } from 'react-redux';

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

const LibraryList = () => {
    const dummyuser = '/images/avatar/dummyuser.png'
    const [show, setShow] = useState(false)
    const [page, setPage] = useState(1)
    const [content_type, setContent_type] = useState('')
    const dispatch = useDispatch()
    const { library, userData } = useSelector(state => state.userReducer)
    const { ratingModel } = useSelector(state => state.modelReducer)

    useEffect(() => {
        setShow(true)
    },[])
    useEffect(() => {
        dispatch(getLibrary({
            content_type: '1',
            page,
            tab: 'Most Recent'
        }))
    }, [dispatch])

    const [menuTab] = useState([
        {
            name: 'Most Recent',
            id: '1'
        },
        {
            name: 'Downloaded',
            id: '2'
        },
        {
            name: 'Purchased',
            id: '3'
        }
    ])

    const [dataFilter] = useState(
        [
            // {
            //     icon: 'icon-fl-sort-filled',
            //     name: 'Comic',
            //     id: 1
            // },
            // {
            //     icon: 'icon-fl-heart-filled',
            //     name: 'Art',
            //     id: 2
            // }
        ]
    )

    const handleFilter = (item) => {
        setPage(1)
        setContent_type(item.id)
        if (library.activeTab === "Most Recent") {
            dispatch(getLibrary({
                content_type: item.id,
                page: 1,
                tab: 'Most Recent'
            }))
        } else if (library.activeTab === "Downloaded") {
            dispatch(getLibrary({
                content_type: item.id,
                page: 1,
                tab: 'Downloaded'
            }))
        } else if (library.activeTab === "Purchased") {
            dispatch(getLibrary({
                content_type: item.id,
                is_paid: 1,
                page: 1,
                tab: 'Purchased'
            }))
        }
    }

    const handleLoadMore = () => {
        setPage(preState => preState + 1)
        if (library.activeTab === "Most Recent") {
            dispatch(getLibrary({
                content_type: '1',
                page: page + 1,
                tab: 'Most Recent'
            }))
        } else if (library.activeTab === "Downloaded") {
            dispatch(getLibrary({
                content_type: "1",
                page: page + 1,
                tab: 'Downloaded'
            }))
        } else if (library.activeTab === "Purchased") {
            dispatch(getLibrary({
                content_type: '1',
                page: page + 1,
                tab: 'Purchased'
            }))
        }
    }

    const HandleTab = (item) => {
        if (item.id === '1') {
            dispatch(getLibrary({
                content_type: '1',
                page,
                tab: 'Most Recent'
            }))
        } else if (item.id === '2') {
            dispatch(getLibrary({
                content_type: '1',
                page,
                tab: 'Downloaded'
            }))
        } else if (item.id === '3') {
            dispatch(getLibrary({
                content_type: '1',
                page,
                is_paid: 1,
                tab: 'Purchased'
            }))
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

        dispatch(
            ratingShow({
                show: true,
                id: item.id,
                type: item.type,
                index
            })
        )
    }

    return ( isWindow() && show &&
        <Fragment>
            <div className='authors-2 libraryList'>
                <section className="tf-activity s1 tf-section library tf-section authors">
                    <div className="themesflat-container pt-80">
                        <div className="row mobileReverse">
                            <div className="col-lg-8 col-md-8 col-12 ">

                                <div className="flat-tabs tab-authors">
                                    <Tabs>
                                        <TabList>
                                            {
                                                menuTab.map((item, index) => (
                                                    <Tab key={index} onClick={() => HandleTab(item)} value={item.value}>{item.name}</Tab>
                                                ))
                                            }
                                        </TabList>
                                    </Tabs>
                                </div>
                                {library.data.length === 0 ? <Fragment>
                                    <div className='dataNotFound'>
                                        <h2 className='dataNotFoundHeading text-center'>No Content Found</h2>
                                    </div>
                                </Fragment> :
                                    library.data.map((item, index) => (
                                        <div className="sc-card-activity style1 sc_card" key={index}>
                                            <div className="content">
                                                <div className="media">
                                                    <img src={item.cover_image} alt="novatoons" />
                                                </div>
                                                <div className="infor">
                                                    <h3 className='cursorPointer innerPointer text_size_a'> 
                                                        <Link className='cursorPointer text_size3 ' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/detail/${item.slug}`}>
                                                            {item.title} 
                                                            {window.innerWidth > 576 ?
                                                            <span className='batch searchBatch ml-4'>{item.genre_name}</span>
                                                              : '' }
                                                            </Link>
                                                    </h3>
                                                    {window.innerWidth < 576 ?
                                                    <div className="CardGenre mb-3 text_size_a">
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
                                                    <div className="authorDetails mylib" >
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
                                        </div>
                                    ))
                                }
                                {
                                    library.load_more &&
                                    <div className="col-md-12 wrap-inner load-more text-center">
                                        <div id="load-more" className="sc-button loadmore fl-button pri-3 mt-10 cursorPointer" onClick={handleLoadMore}><span>Load More</span></div>
                                    </div>
                                }
                            </div>
                            <div className="col-lg-4 col-md-4 col-12 ">

                                <div id="side-bar" className="side-bar style-2">
                                    <div className="widget widget-filter style-2 mgbt-0">
                                        {/* <h3 className="title-widget">Select Content Type</h3>
                                        <ul className="box-check">
                                            {
                                                dataFilter.map((item, index) => (
                                                    <li key={index}><div onClick={() => handleFilter(item)} className={(content_type === (index + 1)) ? "cursorPointer box-widget-filter customFilter activeFilter" : "cursorPointer box-widget-filter customFilter"}>{item.name}</div></li>
                                                ))
                                            }

                                        </ul> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {ratingModel && <RatingModel />}
        </Fragment>
    );
}

export default LibraryList;
