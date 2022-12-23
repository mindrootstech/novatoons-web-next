import React, { useState } from 'react'
import { Content_typeModel } from "../../model"
import {
  resettypes,
  modelShow,
  page_name,
  toggleMenus,
  idupdate,
  notificationBar,
  searchBarAction
} from "../../../redux/headerReducer";
import { useSelector, useDispatch } from "react-redux";
const index = () => {
  const dispatch = useDispatch() 
  const [show, setshow] = useState(false)
  const headerReducer = useSelector((state) => state.headerReducer);
  const user = useSelector((state) => state.userReducer.userData);

  const handleModel = () => {
    if (user.is_verified === 0 || user.is_verified === "0") {
      return toast.warning(
        <SuccessToast message="Verify your email to use this feature" />,
        { hideProgressBar: true, autoClose: 4000 }
      );
    }
    dispatch(resettypes());
    dispatch(modelShow(true));
  };
  return (<>
    <div className="sc-btn-top mg-r-12" id="site-header">
      <div
        onClick={handleModel}
        className="upload_btn sc-button header-slider style style-1 fl-button pri-1 mr-3"
      >
        <span className="textBtn">
          <i className="fa fa-file-upload DesktopNone mr-2"></i>
          Upload Content
        </span>
      </div>
    </div>
    {headerReducer.showModel && <Content_typeModel />}
  </>
  )
}

export default index