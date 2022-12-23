import React, {Fragment,useState, useRef, useEffect} from "react";
//components
import Branding from "./Branding";
import Mainmenu from "./Menu/Mainmenu"
import Search from "./Search";
import RightMenu from "./Menu/RightMenu";
import Notificatiion from "./Notification"
import ProFileDropdown from "./ProfileDropdown"
import UploadContent from "./UploadContent"
import {DonateModel,AddBalance,Content_typeModel} from "../model"
import { isUserLoggedInToken, isUserLoggedIn, userData } from "../../config";

//redux
import {
  resettypes,
  modelShow,
  page_name,
  toggleMenus,
  idupdate,
  notificationBar,
  searchBarAction
} from "../../redux/headerReducer";
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  resetUserData,
  getNotifications,
  appendNotifications,
  notificationStatusUpdate
} from "../../redux/userReducer";
import { searchData, resetFilterd } from "../../redux/commonReducer";
import { addBalancePopoup } from "../../redux/creditReducer";
import { getAllData, resetFilter } from "../../redux/allDataReducer";

const Header = (socket) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const { pathname } = useLocation();
  const [menuState, setMenuState] = useState(false);
  const headerRef = useRef(null);
  const [myData, setMyData] = useState({});
  const [redDotActive, setRedDotActive] = useState(false)

  const headerReducer = useSelector((state) => state.headerReducer);
  const user = useSelector((state) => state.userReducer.userData);
  const { filteredData, loading, searching, load_more, page } = useSelector(
    (state) => state.commonReducer
  );
  const { show } = useSelector((state) => state.creditReducer);
  const { donateModel } = useSelector((state) => state.modelReducer);
  const { filterData } = useSelector(state => state.allDataReducer)
  const {
    is_paid,
    is_mature,
    category,
    genre_id,
    sortby
  } = filterData

  useEffect(() => {
    const userToken = '' 
    // searchParams.get('t')
    const loggedinBy = ''
    // searchParams.get('u')
    const admin_token = ''
    // searchParams.get('at')
    // if (userToken && userToken !== "") {
    //   sessionStorage.clear()
    //   localStorage.clear()
    //   sessionStorage.setItem('token', userToken)
    //   sessionStorage.setItem('loggedinBy', loggedinBy)
    //   sessionStorage.setItem('admin_token', admin_token)
    // }

    if (userToken && userToken !== "" && loggedinBy && loggedinBy !== "") {
      dispatch(
        getUser()
      )
    }

  }, [])

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("getNotification", (data) => {
  //       const { sender_name, receiver_id, content_id, slug, notification_type, comment_id, notfication_content_type, sender_id, comment_parent_id } = JSON.parse(data)
  //       setMyData({ sender_name, receiver_id, content_id, slug, notification_type, comment_id, notfication_content_type, sender_id, comment_parent_id });
  //     }
  //     );
  //     socket.on("activeUsers", (data) => {
  //       console.log(data, "active users")
  //     });
  //   }
  // }, [socket]);

  useEffect(() => {
    if (Object.keys(myData).length > 0) {
      dispatch(
        appendNotifications({
          sender_name: myData.sender_name,
          sender_id: myData.sender_id,
          notification_type: myData.notification_type,
          slug: myData.slug,
          content_id: myData.content_id,
          comment_id:myData.comment_id,
          status: 0,
          receiver_id: myData.receiver_id,
          created_at: new Date(),
        })
      );
    }
  }, [myData]);

  useEffect(() => {
    if ((user === undefined || Object.keys(user).length === 0) && isUserLoggedIn()) {
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const userToken = ''
    // searchParams.get('t')
    const visit_url = ''
    // searchParams.get('url')
    if (visit_url && visit_url !== "") {
      navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${visit_url}`)
    } else {
      if (userToken && userToken !== "") {
        setSearchParams()
      }
    }
  }, [user.userData]);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      dispatch(getNotifications());
    }
  }, [user])



  

  const HandleAddBalance = () => {
    if (user.is_verified === 0 || user.is_verified === "0") {
      return toast.warning(
        <SuccessToast message="Verify your email to use this feature" />,
        { hideProgressBar: true, autoClose: 4000 }
      );
    }
    dispatch(
      addBalancePopoup({
        showHide: true,
      })
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  const hideSearch = e => {
    if (e.target.classList.contains("search-field")) return
    dispatch(searchBarAction(!headerReducer.searchBar));
    dispatch(resetFilterd());
  };

  // useEffect(() => {
  //   if (headerReducer.searchBar) {
  //     document.addEventListener("click", hideSearch);
  //   }
  //   return () => {
  //     document.removeEventListener("click", hideSearch);
  //   };
  // }, [headerReducer.searchBar])

  const toggleNotification = () => {
    dispatch(notificationBar(!headerReducer.notifyBar));
  };

  // useEffect(() => {
  //   if (headerReducer.notifyBar) {
  //     document.addEventListener("click", toggleNotification);
  //   }
  //   return () => {
  //     document.removeEventListener("click", toggleNotification);
  //   };
  // }, [headerReducer.notifyBar]);

  // useEffect(() => {
  //   if (headerReducer.toggleMenu) {
  //     document.addEventListener("click", catchEvent);
  //   }
  //   return () => {
  //     document.removeEventListener("click", catchEvent);
  //   };
  // }, [headerReducer.toggleMenu]);

  useEffect(() => {
    if (menuState) {
      document.addEventListener("click", catchEventMenu);
    }
    return () => {
      document.removeEventListener("click", catchEventMenu);
    };
  }, [menuState]);

  const isSticky = (e) => {
    const header = document.querySelector(".js-header");
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header.classList.add("is-fixed")
      : header.classList.remove("is-fixed");
    scrollTop >= 400
      ? header.classList.add("is-small")
      : header.classList.remove("is-small");
  };

  
  const notification = redDotActive ? 'notificationIcon has-notification' : 'notificationIcon';

  // const searchBtn = (e, item) => {
  //   dispatch(resetFilterd());
  //   if (item?.type === "series") {
  //     dispatch(getSeries({ series_id: item.id }));
  //     navigate(
  //       `${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/detail/${item.id}?type=1`
  //     );
  //   } else {
  //     dispatch(getContent({ content_id: item.id }));
  //     navigate(
  //       `${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.id}?type=0`
  //     );
  //   }

  //   btnSearch.current.classList.toggle("active");
  // };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleOnClick = (index) => {
    dispatch(resetFilter());
    let page;
    if (index === 1) {
      page = "Comic";
    } else if (index === 2) {
      page = "Art";
    } else if (index === 3) {
      page = "E-book";
    } else if (index === 4) {
      page = "NFT";
    } else if (index === 5) {
      page = "Explore";
    }

    dispatch(page_name(page));
    dispatch(idupdate(index === 3 ? "" : index));
    setActiveIndex(index);
    let typeContent = searchParams.get("datatype");
    if (
      typeContent !== null ||
      typeContent !== undefined ||
      typeContent !== ""
    ) {
      dispatch(
        getAllData({
          page: 1,
          // content_type: index === 3 || index === 5 ? "" : index,
          content_type: 1,
          is_paid,
          is_mature,
          category,
          genre_id,
          sortby,
        })
      );
    }
  };

  // const showDropDown = () => {
  //   if (!headerReducer.toggleMenu) {
  //     dispatch(toggleMenus(true));
  //   } else {
  //     dispatch(toggleMenus(false));
  //   }
  // };

  

  const handeSerachBar = (e) => {
    if (e.target.value === "") {
      dispatch(resetFilterd());
    } else {
      dispatch(
        searchData({
          page: 1,
          keyword: e.target.value,
        })
      );
    }
  };

  const catchEvent = (e) => {
    var classes = e.target.classList;
    if (
      !classes.contains("avatar_popup") &&
      !classes.contains("header_avatar")
    ) {
      dispatch(toggleMenus(false));
    }
  };

  const catchEventMenu = (e) => {
    var classes = e.target.classList;
    if (!classes.contains("main-nav") && !classes.contains("mobile-button")) {
      setMenuState(false);
    }
  };

 

  const handleNotificationBar = async () => {
    dispatch(notificationBar(!headerReducer.notifyBar));
    dispatch(getNotifications());

  };


  const notificationSeen = async (item, dispatch, navigate, i) => {
    try {
      const dataMain = item
      if(item.status === 0) {
        await axiosRequest({sub_url: '/notificationseen', dataMain})
      }
    
      dispatch(
        notificationStatusUpdate({
          index: i
        })
      )
      NotificationHandler(dataMain, dispatch, navigate)

    } catch (err) {
      console.log(err)
      return toast.warning(
        <SuccessToast message={err?.response?.data?.message} />,
        { hideProgressBar: true, autoClose: 4000 }
      );
    }
  }
  const displayNotification = (item, index) => {
    let notification_message;
    if (item.notification_type === 1) {
      notification_message = "Content Created successfully";
    } else if (item.notification_type === 2) {
      notification_message = "Series Created successfully";
    } else if (item.notification_type === 3) {
      notification_message = `${item.sender_name} liked your comment.`;
    } else if (item.notification_type === 4) {
      notification_message = `${item.sender_name} comment on your content.`;
    } else if (item.notification_type === 5) {
      notification_message = `${item.sender_name} liked your content.`;
    } else if (item.notification_type === 6) {
      notification_message = `${item.sender_name} liked your series.`;
    } else if (item.notification_type === 7) {
      notification_message = `${item.sender_name} reply on your comment`;
    }

    return (
      <div
        className="cursorPointer notificationList"
        onClick={() => {
          item.status === 0 ? notificationSeen(item, dispatch, navigate, index) : NotificationHandler(item, dispatch, navigate)
        }}
      >
        <div className="notificationBar">
          <div className="notification notificationLi">
            <i className="fa fa-comments" aria-hidden="true"></i>
            <p>{notification_message}</p>
            {item.status === 0 && <span className="redDot redDot2"></span>}
          </div>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
    <header id="header_main" className="header_1 js-header">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div className="wrap-box flex">
                  <Branding />
                  <Mainmenu/>
                <div className="flat-search-btn flex">
                  <Search/>
                 { Object.keys(user).length === 0 ?
                  <RightMenu/> : <>
                  <UploadContent />  <Notificatiion />
                  <ProFileDropdown />
                  </>} 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
</Fragment>  );
};

export default Header;
