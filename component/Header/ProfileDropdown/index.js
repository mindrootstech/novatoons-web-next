import { useRouter } from 'next/router';
import Link from 'next/link'
import React, { useRef, useState, useEffect, Fragment } from "react";
import {DonateModel,AddBalance,Content_typeModel} from "../../model"
//redux
import {
    resettypes,
    modelShow,
    page_name,
    toggleMenus,
    idupdate,
    notificationBar,
    searchBarAction
  } from "../../../redux/headerReducer";
  import {
    getUser,
    resetUserData,
    getNotifications,
    appendNotifications,
    notificationStatusUpdate
  } from "../../../redux/userReducer";

import { searchData, resetFilterd } from "../../../redux/commonReducer";
import { addBalancePopoup } from "../../../redux/creditReducer";
import { getAllData, resetFilter } from "../../../redux/allDataReducer";
import { useSelector, useDispatch } from "react-redux";
import { postRequest } from "../../../commonApi";
import { axiosRequest } from "../../../http";
import { toast } from 'react-toastify';
//fakedata

function SuccessToast({ message }) {
    return (
      <Fragment>
        <div className="toastify-header">
          <div className="title-wrapper">
            <h6 className="toast-title">{message}</h6>
          </div>
        </div>
      </Fragment>
    );
  }
  
const index = () => {
    const usericon = "/images/icon/usericon.svg";
    const transactions = "/images/icon/transactions.svg";
    const reporting = "/images/icon/reporting.svg";
    const payouts = "/images/icon/payout.svg";
    const myupload = "/images/icon/myuploads.svg";
    const logouticon = "/images/icon/logouticon.svg";
    const dummyUser = "/images/avatar/dummyuser.png";
    const subscription = "/images/icon/subscription.svg";
    const library = "/images/icon/library.svg";
  const dispatch = useDispatch()
 const router = useRouter()
  const headerReducer = useSelector((state) => state.headerReducer);
    const { show } = useSelector((state) => state.creditReducer);
    const { donateModel } = useSelector((state) => state.modelReducer);
  const user = useSelector((state) => state.userReducer.userData);
   

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
    
    //
    const handleLogout = async () => {
        const response = await postRequest({ sub_url: "/logout" });
        if (response.status === true) {
          toast.success(<SuccessToast message={response.message} />, {
            hideProgressBar: true,
            autoClose: 4000,
          });
          localStorage.clear();
          sessionStorage.clear();
          dispatch(resetUserData());
          dispatch(
            resetFilter()
          )
          router.push("./login")
        //   navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/login`);
        } else {
          toast.success(<SuccessToast message={response.message} />, {
            hideProgressBar: true,
            autoClose: 4000,
          });
        }
      };
   const showDropDown = () => {
    if (!headerReducer.toggleMenu) {
      dispatch(toggleMenus(true));
    } else {
      dispatch(toggleMenus(false));
    }
  };

  
    return ( <>
        <div className="admin_actives ml-4" id="header_admin">
            <div className="header_avatar" onClick={showDropDown}>
                <img
                    loading='lazy'
                    className="avatar"
                    src={
                        Object.keys(user).length > 0 &&
                            user.profile_img === ""
                            ? dummyUser
                            : user.profile_img
                    }
                    alt="avatar"
                />
                <div
                    className={
                        headerReducer.toggleMenu
                            ? `avatar_popup mt-20 px-4 visible`
                            : `avatar_popup mt-20 px-4`
                    }
                >
                    <div className="avatar_title_text">
                        <h3>
                            <span>
                                {Object.keys(user).length !== 0
                                    ? user?.user_name !== "" &&
                                        user?.is_creator === 1
                                        ? user.user_name
                                        : `${user?.first_name} ${user?.last_name}`
                                    : userData() && `${userData().first_name} ${userData().last_name
                                    }`}
                            </span>

                            <span className="float-right ratingFlex"> <i className="fa fa-star f-20 colorYellow"></i> {user?.rating != "NaN" ? parseFloat(user?.rating).toFixed(2) : 0}</span>
                        </h3>
                    </div>
                    <div className="avatar_balance_board">
                        <div className="balance_box">
                            <div className="balance_text">
                                Credit Balance
                            </div>
                            <div className="total_balance">
                                {Object.keys(user).length !== 0 &&
                                    `${Math.abs(
                                        parseFloat(user.total_credits)
                                    )} Cr`
                                    //  ${Math.abs(
                                    //   parseFloat(user.total_amount)
                                    // )} USD`
                                }
                            </div>
                        </div>
                        <div className="balance_button">
                            <span
                                onClick={HandleAddBalance}
                                className="sc-button style-1 fl-button pri-1"
                            >
                                <span>Add Balance</span>
                            </span>
                        </div>
                    </div>

                    <div className="links avatar_links_profile">
                        <ul
                            onClick={() => {
                                dispatch(toggleMenus(false));
                            }}
                        >
                            <li>
                                <Link
                                    href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit-profile`}
                                >
                                    <div id="myprofile">
                                        <img loading='lazy' alt="Profile" src={usericon} />
                                        <span> My Profile</span>
                                    </div>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/transactions`}
                                >
                                    <div id="transactions">
                                        <img
                                            loading='lazy'
                                            alt="transactions"
                                            src={transactions}
                                        />
                                        <span> Transactions</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/favorites`}
                                >
                                    <div id="favorites">
                                        <img loading='lazy' alt="favorites" src={reporting} />{" "}
                                        <span> Favorites</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/my-library`}
                                >
                                    <div id="library">
                                        <img loading='lazy' alt="favorites" src={library} />
                                        <span> My Library</span>
                                    </div>
                                </Link>
                            </li>
                            {/* <li>
              <Link
                href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/subscription-plan`}
              >
                <div id="subscription">
                  <img
                    loading='lazy'
                    alt="subscription"
                    src={subscription}
                  />
                  <span> Subscriptions</span>
                </div>
              </Link>
            </li> */}

                            {/* <li>
                <div id="reporting">
                    <img alt="reporting" src={reporting} /> <span> Reporting</span>
                </div>
            </li> */}
                            {user?.is_creator === 1 && (
                                <Fragment>
                                    <li>
                                        <Link
                                            href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/payouts`}
                                        >
                                            <div id="payouts">
                                                <img loading='lazy' alt="payouts" src={payouts} />{" "}
                                                <span> Payouts</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/myuploads`}
                                        >
                                            <div id="myupload">
                                                <img
                                                    loading='lazy'
                                                    alt="myupload"
                                                    src={myupload}
                                                />{" "}
                                                <span> My uploads</span>
                                            </div>
                                        </Link>
                                    </li>
                                </Fragment>
                            )}

                            <li>
                                <div onClick={handleLogout} id="logout">
                                    <img loading='lazy' alt="logouticon" src={logouticon} />
                                    <span> Logout</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
          {show && <AddBalance />}
          {donateModel && <DonateModel />}
          </>
    )
}

export default index