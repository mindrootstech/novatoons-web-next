import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom"; 

//third-party
import { toast } from "react-toastify";
import { Row, Col, FormFeedback } from "reactstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

//Form
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";

//custom component
// import CroppingPopup from "../../components/model/croppingPopup";
import {SeriesPreviewModel, CroppingPopup} from "../model";
import widgetSidebarData from "../../assets/fake-data/data-widget-sidebar"
// //redux
// import { useDispatch, useSelector } from "react-redux";
// import { cropPopUp } from "../content/editContentSeriesReducer";
// import { cover_image_ratio } from "../content/ContentSeriesReducer";
// import { modelShow, resettypes } from '../../components/header/store/headerReducer'
// import { getGenre, getTags } from "../../redux/tagReducer";
// import { getUser, appendNotifications } from '../user/userReducer'


//style
import { customStyles } from "../../assets/themeconfig";
// import { axiosRequest } from "../../http";

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

const SeriesForm = ({onChange,socket}) => {
  // const navigate = useNavigate()
  // // const dispatch = useDispatch();
  // const { croppopup } = useSelector((state) => state.editSeriesReducer);
  // const { tags, genres } = useSelector((state) => state.tagReducer);
  // const { seriesPreviewData } = useSelector((state) => state.modelReducer);
  // const { userData } = useSelector((state) => state.userReducer);
const croppopup = { show : false}
const genres = widgetSidebarData
const tags = ['saas']
const seriesPreviewData = {show: true}
  //states
  const [tagPlaceholder, setTagPlaceholder] = useState(false);
  const [genre_id, setGenre_id] = useState(null);
  const [tags_ids, setTags_ids] = useState([]);
  const [sub_genre_id, setSub_genre_id] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false)

  const createSeriesSchema = yup.object().shape({
    is_matured: yup.number().required(),
    title: yup.string().required(),
    cover_image: yup
      .mixed()
      .test("required", "You need to provide a file", (value) => {
        if (value.length > 0) {
          return true;
        }
        return false;
      })
      .test("fileSize", "The file is too large (Max-limit is 2mb)", (value) => {
        if (value.length > 0) {
          return value && value[0].size <= 2000000;
        }
        return true;
      })
      .test(
        "type",
        "The file format should be the jpeg, png, jpg only",
        (value) => {
          if (value.length > 0) {
            return (
              value &&
              (value[0].type === "image/jpg" ||
                value[0].type === "image/png" ||
                value[0].type === "image/jpeg")
            );
          }
        }
      ),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm({ mode: "onChange", resolver: yupResolver(createSeriesSchema) });

  // single image section
  const uploadImage = (e) => {
    
    const uplaodfile = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const upload_File = reader.result;
      var img = new Image;
      img.src = upload_File

      img.onload = function() {

        if(img.width !== 270 && img.height !== 400) {
          return setError("cover_image", {
              type: "manual",
              message: "Image size must be 270x400(px) and less than 2MB"
          });
        }
          // dispatch(
          //     cover_image_ratio({
          //         width: img.width,
          //         height: img.height,
          //         ratio: img.height <= 400 && img.width <= 270
          //     })
          // )
      }

      // dispatch(
      //   cropPopUp({
      //     show: false,
      //     file: upload_File,
      //     coverfilename: uplaodfile.name,
      //   })
      // );
      
    };
    reader.readAsDataURL(uplaodfile);
  };

  // Import Genre
  // useEffect(() => {
  //   dispatch(getGenre());
  // }, [dispatch]);

  // genre handle
  const GenreHandle = (e) => {
    clearErrors("genre_id");
    setGenre_id(e.id);
    // dispatch(
    //   getTags({
    //     genre_id: e.id,
    //   })
    // );
  };

  //Tags Handle
  const TagsHandle = async (newValue, actionMeta) => {
    const filtered = newValue.slice(-1)[0];
    if (actionMeta.action === "create-option" && filtered.__isNew__ === true) {
      try {
        const response = await axiosRequest({
          sub_url: "/inserttags",
          dataMain: { tag: filtered.value, genre_id },
        });
        if (response.status === 200) {
          newValue[newValue.length - 1].id = response.data.data;
          toast.success(<SuccessToast message={response.data.message} />, {
            hideProgressBar: true,
            autoClose: 8000,
          });
        }
      } catch (err) {
        return toast.warning(<SuccessToast message={err.response.message} />, {
          hideProgressBar: true,
          autoClose: 8000,
        });
      }
    }

    const filterTags = newValue.map((item) => {
      return item.value;
    });
    let i = 0;
    let filterids = [];

    filterTags.forEach(function (tag) {
      filterids.push(newValue[i].id);
      i++;
    });
    if (filterids.length > 0) {
      clearErrors("tag_ids");
    }
    setTags_ids(filterids);
    setTagsSelected(filterTags);
  };

  // form Submit
  const onSubmit = async (data) => {
    if (genre_id === null) {
      return setError("genre_id", {
        type: "required",
        message: "Please select at least 1 genre type",
      });
    } else if (tags_ids.length === 0) {
      return setError("tag_ids", {
        type: "required",
        message: "Please select at least 1 tag",
      });
    }

    const uploadData = localStorage.getItem("uploadcontent")
    if(!uploadData) {
      dispatch(resettypes());
      toast.warning(
        <SuccessToast message={"Please select content type"} />,
        {
          hideProgressBar: true,
          autoClose: 8000,
        }
      );
      return dispatch(modelShow(true));
    }
    let content_Data = JSON.parse(uploadData)
    setRequestLoading(true)

    const dataMain = {
      ...data,
      cover_image: croppopup.file,
      cover_image_name: croppopup.coverfilename,
      genre_id,
      sub_genres_id: sub_genre_id.join(),
      tag_ids: tags_ids.join(),
      content_type: content_Data.content_type,
      mature_content: data.is_matured
    };

    try {
      const response = await axiosRequest({
        sub_url: "/createseries",
        dataMain,
      });
      if (response.status === 200) {
        setRequestLoading(false)
      //   if(socket && response){
      //     socket?.emit("sendNotification", 
      //     JSON.stringify({
      //         sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
      //         receiver_id: userData?.id,
      //         content_id: response?.data?.body.id,
      //         slug: response?.data?.body?.slug,
      //         notification_type: 2,
      //         sender_id: userData.id,
      //     })
      // )
      // }
      // dispatch(
      //       appendNotifications({
      //           sender_name: userData?.id,
      //           sender_id: userData?.id,
      //           notification_type: 2,
      //           status: 0,
      //           series_id: response?.data?.body.id,
      //           slug: response?.data?.body?.slug,
      //           receiver_id: userData?.id,
      //           created_at: new Date(),
      //       })
      //   );
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/createcontents/${response.data.body.slug}`)
       
      
      }
    } catch (err) {
      setRequestLoading(false)
      return toast.warning(
        <SuccessToast message={err.response.data.message} />,
        {
          hideProgressBar: true,
          autoClose: 8000,
        }
      );
    }
  };

  return (
    <div className="col-xl-9 col-lg-6 col-md-12 col-12">
      <div className="form-create-item createItem">
        <form className="createContentForm" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Cover file upload */}
            <Col md={12} sm={12}>
              <h4 className="title-create-item">Series Cover </h4>
              <label
                className={classnames("uploadFile", {
                  "is-invalid": errors?.cover_image,
                })}
              >
                <div className="filename thumbFile">
                  {croppopup.coverfilename !== "" &&
                  croppopup.coverfilename !== null
                    ? croppopup.coverfilename
                    : "Please upload image (jpeg, jpg, png) upto 2 mb in size (Dimension = width 270px and height 400px)"}
                </div>
                <div className="upload-btn-wrapper">
                  <div className="designedBtn">Select file</div>
                  <input
                    type="file"
                    id="cover_image"
                    className="inputfile form-control"
                    accept=".jpeg, .png, .jpg"
                    {...register("cover_image", {
                      onChange: (e) => {
                        uploadImage(e, "uploadCover");
                      },
                    })}
                  />
                </div>
              </label>
              {errors?.cover_image && (
                <FormFeedback className="mb-4">
                  {errors?.cover_image.message}
                </FormFeedback>
              )}
            </Col>
            {/* Cover file upload */}

            {/* Series title */}
            <Col sm={12}>
              <h4 className="title-create-item">Series Title </h4>
              <input
                type="text"
                {...register("title", { required: "true", onChange: (e) => {
                  onChange(e.target.value)
                } })}
                placeholder="Item name"
                className={classnames("input", { "is-invalid": errors?.title })}
              />
              {errors?.title && (
                <FormFeedback className="mb-4">
                  Title is a required field
                </FormFeedback>
              )}
            </Col>
            {/* Collection Title end*/}

            {/* Collection Description */}
            <Col sm={12}>
              <h4 className="title-create-item">Series Description</h4>
              <textarea
                className="textAreaField"
                {...register("description", { required: true })}
                placeholder="e.g. “This is very limited item”"
              ></textarea>
            </Col>
            {/* Collection Description end */}

            {/* Mature Content or not */}
            <Col sm={12}>
              <h4 className="title-create-item">Matured Content</h4>
              <Row>
                <Col className="mb-2 mobileKliye" sm={4}>
                  <input
                    type="radio"
                    {...register("is_matured", { required: true })}
                    className="isPaidOrFree"
                    value="1"
                  />
                  <div
                    className={
                      watch("is_matured") === "1"
                        ? "activebtn btnforMature"
                        : "btnforMature"
                    }
                  >
                    Yes
                  </div>
                </Col>
                <Col className="mb-2 mobileKliye" sm={4}>
                  <input
                    type="radio"
                    {...register("is_matured", { required: true })}
                    className="isPaidOrFree"
                    value="0"
                  />
                  <div
                    className={
                      watch("is_matured") === "0"
                        ? "activebtn btnforMature"
                        : "btnforMature"
                    }
                  >
                    No
                  </div>
                </Col>
                {errors?.is_matured && (
                  <Col sm={12}>
                    <FormFeedback className="mb-4">
                      Is this content for 18+ audience? Please select Yes or No
                    </FormFeedback>
                  </Col>
                )}
              </Row>
            </Col>
            {/* Mature Content or not end */}

            {/* Primary Genre */}

            {genres.length > 0 && (
              <Col sm={12} className="mt-4">
                <h4 className="title-create-item">Genre 1</h4>
                <Select
                  {...register("genre_id")}
                  styles={customStyles}
                  options={genres}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Genre 1"
                  onChange={GenreHandle}
                />
                {errors?.genre_id && (
                  <FormFeedback className="mb-2 mt-2">
                    {errors?.genre_id?.message}
                  </FormFeedback>
                )}
              </Col>
            )}

            {/* Primary Genre */}

            {/* Secondry Genre */}

            {genres.length > 0 && (
              <Col sm={12} className="mt-4">
                <h4 className="title-create-item">Genres 2</h4>
                <Select
                  isMulti
                  isClearable={false}
                  {...register("sub_genres_id")}
                  styles={customStyles}
                  options={genres}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(e) => {
                    if (e.length > 0) {
                      let array = [];
                      e.map((item) => array.push(item.id));
                      setSub_genre_id(array);
                    }
                  }}
                  placeholder="Genres 2"
                />
              </Col>
            )}

            {/* Secondry Genre */}

            {/* Tags Input */}

            {tags.length > 0 && genre_id !== null && (
              <Fragment>
                <Col className="mt-4 tagSection" sm={12}>
                  <h4 className="title-create-item">
                    Tags
                    <i
                      className="fa fa-question-circle ml-3"
                      aria-hidden="true"
                    >
                      <div className="tooltiptext">
                        <h6 className="mb-2">Can't find your tag?</h6>
                        Tags can be added manually by simply typing them in and
                        hitting the "Enter" key. This will add the tag you want
                        to the list.
                      </div>
                    </i>
                  </h4>
                  <CreatableSelect
                    isMulti
                    isClearable={false}
                    {...register("tag_ids", { required: true })}
                    onChange={TagsHandle}
                    onFocus={() => setTagPlaceholder(true)}
                    onBlur={() => setTagPlaceholder(false)}
                    options={tags}
                    onMenuScrollToTop={true}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={customStyles}
                    placeholder={!tagPlaceholder && "Add Tags"}
                  />
                  {errors?.tag_ids && (
                    <FormFeedback className="mb-2 mt-2">
                      {errors?.tag_ids?.message}
                    </FormFeedback>
                  )}
                </Col>
              </Fragment>
            )}

            {/* Tags Input */}

            <Col sm={12} className="text-right">
              <button className="PrimaryBtn mt-5" type="submit" disabled={requestLoading}> {requestLoading ? 'Uploading...' : 'Continue to upload'}  </button>
            </Col>
          </Row>
        </form>
      </div>

      {croppopup.show && <CroppingPopup />}

      {seriesPreviewData.show && (
        <SeriesPreviewModel
          previewData={{
            title: watch("title"),
            description: watch("description"),
            cover_image: croppopup.file,
            genre_id,
            sub_genres_id: sub_genre_id.length > 0 ? sub_genre_id.join() : [],
            tag_ids: tags_ids.length > 0 ? tags_ids.join() : [],
            is_matured: watch("is_matured"),
            tagsSelected,
          }}
        />
      )}
    </div>
  );
};

export default SeriesForm;
