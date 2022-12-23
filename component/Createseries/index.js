import React, { Fragment, useState } from "react";
// import { Link, useParams } from "react-router-dom";
//Images
import placeholder from '../../assets/images/contentImages/placeholder.png'
import dummyuser from '../../assets/images/avatar/dummyuser.png'

//custom component
import SeriesForm from "./createSeries";
// import {DeleteModel} from '../model';

//redux
// import { useDispatch, useSelector } from "react-redux";
// import { seriesPreview } from "../../redux/modelReducer";
import EditSeriesFrom from "./editSeries";
import Link from "next/link";
// import { deleteModel} from '../content/editContentSeriesReducer';

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


const CreateSeries = (socket) => {
    const placeholder = '/images/contentImages/placeholder.png'
    const dummyuser = '/images/avatar/dummyuser.png'
    const [title, setTitle] = useState("")
    //   const dispatch = useDispatch()
    //   const {slug} = useParams()

    //   const {userData} = useSelector(state => state.userReducer)
    //   const {croppopup, series, deleteStuff} = useSelector((state) => state.editSeriesReducer);

    //   const {seriesdata} = series    
    const croppopup = {file: null}
    const seriesdata = {}
    const userData = {}
    const slug = ''
    const deleteStuff = { modelShow: false }
    const handlePreviewModel = () => {
        dispatch(
            seriesPreview({
                show: true,
                data: {}
            })
        )
    }

    const handleDelete = () => {
        dispatch(deleteModel({
            showHide: true,
            content: seriesdata.id,
            isContent: false
        }))
        // try {
        //    const response = await axiosRequest({sub_url: 'deleteseries', dataMain: {series_id: seriesdata.id}})
        //    toast.success(<SuccessToast message={response.data.message} />, {
        //     hideProgressBar: true,
        //     autoClose: 8000,
        //   });
        //   return navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
        // } catch (err) {
        //   return toast.warning(<SuccessToast message={err.response.message} />, {
        //     hideProgressBar: true,
        //     autoClose: 8000,
        //   });
        // }
    }

    const onChange = (e) => {
        setTitle(e)
    }

    return (
        <Fragment>
            <div className="create-item">
                <div className="tf-create-item tf-section">
                    <div className="themesflat-container contentCreate pt-80">
                        <div className="row">
                            <div className="col-xl-3 col-lg-6 col-sm-6 col-12 previewItemCard">
                                <h4 className="title-create-item">Preview item</h4>
                                <div className="sc-card-product">
                                    <div className="card-media">
                                        {/* {croppopup.file !== null ? (
                                            <img src={croppopup.file} alt="preview" />
                                        ) : seriesdata !== null ?
                                            <img src={seriesdata.cover_image} alt="placeholder" />
                                            : */}
                                            <img src={placeholder} alt="placeholder" />
                                        {/* } */}
                                    </div>
                                    <div className="card-title">
                                        <h5>{title === "" ? seriesdata?.title : title}</h5>
                                    </div>
                                    <div className="meta-info">
                                        <div className="author">
                                            <div className="avatar">
                                                <img
                                                    src={
                                                        // userData.profile_img !== ""
                                                        //     ? userData.profile_img
                                                        //     :
                                                             dummyuser
                                                    }
                                                    alt="novatoons"
                                                />
                                            </div>
                                            <div className="info">
                                                <span>Author</span>
                                                <h6>
                                                    <Link
                                                        href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit-profile`}
                                                    >
                                                        {userData.user_name !== "" &&
                                                            userData.is_creator === 1
                                                            ? userData.user_name
                                                            : `${userData.first_name} ${userData.last_name}`}
                                                    </Link>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="previewBtn" onClick={handlePreviewModel}>Preview</div>
                                {slug !== undefined && <div className="previewBtn" onClick={() => handleDelete()}>Delete Series</div>}
                            </div>

                            {/* Create series form */}
                            {/* <SeriesForm onChange={onChange} socket={socket.socket} /> */}
                            <EditSeriesFrom slug={slug} />
                            {/* {slug ? <EditSeriesFrom slug={slug} /> :  <SeriesForm onChange={onChange} socket={socket.socket} />} */}
                            {/* Create series form */}

                        </div>
                    </div>
                </div>
            </div>
            {/* {deleteStuff.modelShow && <DeleteModel />} */}
        </Fragment>
    );
};

export default CreateSeries;
