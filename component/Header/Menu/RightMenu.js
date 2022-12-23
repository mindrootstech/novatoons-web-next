import React, {useState, Fragment} from "react";
import Link from "next/link";

//components
import NotificationsList from './NotificationsList'

//image
import usericon from "../../../public/images/icon/usericon.svg";
import transactions from "../../../public/images/icon/transactions.svg";
import reporting from "../../../public/images/icon/reporting.svg";
import payouts from "../../../public/images/icon/payout.svg";
import myupload from "../../../public/images/icon/myuploads.svg";
import logouticon from "../../../public/images/icon/logouticon.svg";
import dummyUser from "../../../public/images/avatar/dummyuser.png";
import subscription from "../../../public/images/icon/subscription.svg";
import library from "../../../public/images/icon/library.svg";

const notifications = []
const user = {
  "id": 5,
  "first_name": "Rajpreet",
  "last_name": "Giri",
  "user_name": "",
  "email": "rajpreet@mind-roots.com",
  "source_id": "",
  "source_type": 1,
  "total_content": 1,
  "dob": "",
  "gender": 1,
  "bio": "",
  "is_creator": 1,
  "rating": "2",
  "status": 1,
  "profile_img": "",
  "is_mature": "1",
  "stripe_customer_id": "cus_MnzJSdrwxNGVdQ",
  "paypal_id": "",
  "is_verified": "1",
  "facebook_url": "",
  "instagram_url": "",
  "twitter_url": "",
  "tiktok_url": "",
  "created_at": "2022-11-15T04:53:53.000Z",
  "credit_cost": "10",
  "total_credits": "48.00",
  "user_revenue": "0.00",
  "monthly_payout": "0.00",
  "total_amount": "480",
  "is_subscribed": 0,
  "notification": {
      "comment_received": 1,
      "subscribed_author_posts": 1,
      "genre_posts": 1
  },
  "owner_fee": "20",
  "support_message": 0
}

const RightMenu = () => {
  const isAuth = false

  const [haveNotifications, setHaveNotifications] = useState(false)
  const [toggleMenu, setToggleMenu] = useState(false)

  const HandleAddBalance = () => {}
  const handleLogout = () => {}


  return (
    <>
      {!isAuth ? <div className="authButtons ml-4">
      <Link
        className="loginbtn"
        href="/login"
      >
      <span>Login</span>
      </Link>
      <Link
        className="signupbtn"
        href="/sign-up"
      >
        <span>Sign up</span>
      </Link>
    </div> : <Fragment>
    <div
      className="notification_user cursorPointer"
    >
      <div className="notificationIcon">
        <i className="fa fa-bell text-white"></i>
        {haveNotifications && <span className="redDot first"></span>}
      </div>
      {haveNotifications &&
        (notifications.loading &&
        notifications.data.length === 0 ? (
      <div className="notificationBg">
          <div className="notificationBarMain">
            <p>Loading...</p>
          </div>
          </div>
        ) : notifications.data.length > 0 ? (
          <div className="notificationBg">
            <div className="notificationBarMain">
              {notifications.data.map((n, index) =>
                <NotificationsList item={n} index={index} />
              )}
            </div>
          </div>
        ) : (
          <div className="notificationBg">
            <div className="notificationBarMain">
              <h6>No Notifications Yet</h6>
            </div>
          </div>
        ))}
    </div>
    <div className="admin_actives ml-4" id="header_admin">
      <div className="header_avatar" onClick={() => setToggleMenu(!toggleMenu)}>
        <img
        loading='lazy'
          className="avatar"
          src={
            Object.keys(user).length > 0 &&
            user.profile_img === ""
              ? dummyUser.src
              : user.profile_img
          }
          alt="avatar"
        />
        <div
          className={
            toggleMenu
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
                : userData() && `${userData().first_name} ${
                    userData().last_name
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
                  )} Cr / ${Math.abs(
                    parseFloat(user.total_amount)
                  )} USD`}
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
              onClick={() => setToggleMenu(false)}
            >
              <li>
                <Link
                  href={`/edit-profile`}
                >
                  <div id="myprofile">
                    <img loading='lazy' alt="Profile" src={usericon.src} />
                    <span> My Profile</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href={`/transactions`}
                >
                  <div id="transactions">
                    <img
                      loading='lazy'
                      alt="transactions"
                      src={transactions.src}
                    />
                    <span> Transactions</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href={`/favorites`}
                >
                  <div id="favorites">
                    <img loading='lazy' alt="favorites" src={reporting.src} />
                    <span> Favorites</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href={`/my-library`}
                >
                  <div id="library">
                    <img loading='lazy' alt="favorites" src={library.src} />
                    <span> My Library</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href={`/subscription-plan`}
                >
                  <div id="subscription">
                    <img
                      loading='lazy'
                      alt="subscription"
                      src={subscription.src}
                    />
                    <span> Subscriptions</span>
                  </div>
                </Link>
              </li>

              {/* <li>
                  <div id="reporting">
                      <img alt="reporting" src={reporting.src} /> <span> Reporting</span>
                  </div>
              </li> */}
              {user?.is_creator === 1 && (
                <Fragment>
                  <li>
                    <Link
                      href={`/payouts`}
                    >
                      <div id="payouts">
                        <img loading='lazy' alt="payouts" src={payouts.src} />{" "}
                        <span> Payouts</span>
                      </div>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/myuploads`}
                    >
                      <div id="myupload">
                        <img
                          loading='lazy'
                          alt="myupload"
                          src={myupload.src}
                        />
                        <span> My uploads</span>
                      </div>
                    </Link>
                  </li>
                </Fragment>
              )}

              <li>
                <div onClick={handleLogout} id="logout">
                  <img loading='lazy' alt="logouticon" src={logouticon.src} />
                  <span> Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Fragment>}
      
    </>
  );
};

export default RightMenu;
