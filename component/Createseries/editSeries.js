import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

//third-party
import { toast } from "react-toastify";
import { Row, Col, FormFeedback } from "reactstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

//Form
import { set, useForm } from "react-hook-form";
import classnames from "classnames";

//custom component
import {CroppingPopup, SeriesPreviewModel} from "../model";
import dataPopularCollection from "../../assets/fake-data/data-popular-collection"
//redux
import { useDispatch, useSelector } from "react-redux";
// import {
//   cropPopUp,
//   getSeries,
// } from "../content/editContentSeriesReducer";
// import { getGenre, getTags, filterSubGenresAction, filterationTagsGenre } from "../../redux/tagReducer";

//style
import { customStyles } from "../../assets/themeconfig";
// import { axiosRequest } from "../../http";
// import Loader from "../../components/loader/loader";

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

const EditSeriesFrom = ({ slug }) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate()
  // const { croppopup, series, loading } = useSelector((state) => state.editSeriesReducer);
  // const { tags, genres, filteredGenre, filteredTags, filterSubGenre } = useSelector((state) => state.tagReducer);
  // const { seriesPreviewData } = useSelector((state) => state.modelReducer);

  // const { seriesdata } = series
const seriesdata = dataPopularCollection[0]
  //states
  const [tagPlaceholder, setTagPlaceholder] = useState(false);
  const [genre_id, setGenre_id] = useState(null);
  const [tags_ids, setTags_ids] = useState([]);
  const [sub_genre_id, setSub_genre_id] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([])
  const [requestLoading, setRequestLoading] = useState(false)
  const [SavingStatus, setSavingStatus] = useState(false)
  const [isDisable, setisDisable] = useState(false)
  const loading = false
  const genres = ["hello"]
  const tags = ["hello"]
  const series = {}
  const croppopup = {}
  const filteredGenre = {}
  const filterSubGenre = {}
  const filteredTags = {}
  const seriesPreviewData = {}
  // useEffect(() => {
  //   dispatch(
  //     getSeries({
  //       slug
  //     })
  //   )
  // }, [dispatch])

  // useEffect(() => {
  //   if (genres.length > 0) {
  //     if (seriesdata?.genre_id !== undefined) {
  //       const filter = genres.filter(item => {
  //         return item.id === seriesdata?.genre_id
  //       })
        // dispatch(
        //   filterationTagsGenre({
        //     filteredTags: filteredTags,
        //     filteredGenre: filter[0]
        //   })
  //       // )
  //     }
  //     if (seriesdata?.sub_genre_id !== "") {
  //       const sub_genreArray = seriesdata?.sub_genre_id?.split(",")
  //       if (sub_genreArray !== undefined) {
  //         const newArray = sub_genreArray.map(item => {
  //           const xyz = genres.filter(e => {
  //             return e.id === parseInt(item)
  //           })
  //           return xyz
  //         })
  //         let finalData = newArray.map(item => {
  //           return item[0]
  //         })
  //         // dispatch(
  //         //   filterSubGenresAction({
  //         //     data: finalData
  //         //   })
  //         // )
  //       }
  //     }

  //   }
  // }, [loading, genres])

  // useEffect(() => {
  //   if (tags.length > 0 && seriesdata?.tag_ids) {
  //     const lockdown = seriesdata?.tag_ids.split(",")
  //     const abc = lockdown.map(item => {
  //       const filterData = tags.filter(e => {
  //         return e.id === parseInt(item)
  //       })
  //       return filterData
  //     })
  //     const newDataFound = abc.map(item => {
  //       return item[0]
  //     })
  //     setTags_ids(newDataFound)

  //     // dispatch(
  //     //   filterationTagsGenre({
  //     //     filteredTags: newDataFound,
  //     //     filteredGenre
  //     //   })
  //     // )

  //   }
  // }, [tags])

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors
  } = useForm({ mode: "onChange" });

  const matured_content_val = watch("is_matured");

  // useEffect(() => {
  //   if (seriesdata !== null && genres.length > 0) {
  //     reset({
  //       ...seriesdata,
  //       is_matured: JSON.stringify(seriesdata.is_mature),
  //       genre_id: { label: "abc", value: "abc" }
  //     })

  //     if (seriesdata.genre_id) {
  //       // dispatch(
  //       //   getTags({
  //       //     genre_id: seriesdata.genre_id,
  //       //   })
  //       // );
  //     }
  //   }
  // }, [series, genres])


  // single image section
  const uploadImage = (e) => {
    const uplaodfile = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const upload_File = reader.result;
      var img = new Image;
      img.src = upload_File
      img.onload = function () {

        if (img.width !== 270 && img.height !== 400) {
          return setError("cover_image", {
            type: "manual",
            message: "Image size must be 270x400(px) and less than 2MB"
          });
        }
      }

      // dispatch(
      //   cropPopUp({
      //     show: true,
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
    clearErrors('genre_id')
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
      clearErrors('tag_ids')
    }
    setTags_ids(filterids);
    setTagsSelected(filterTags)
  };

  const handleSave = async (e) => {
    if (e === 1) {
      setisDisable(true)
      setSavingStatus(true)
    }
    if (tags_ids.length === 0) {
      return setError('tag_ids', { type: 'required', message: 'Please select a minimum 1 tag' });
    }

    let newTags
    if (tags_ids.length) {
      newTags = tags_ids.map(item => {
        return item.id
      })
    }
    if (e !== 1) {
      setRequestLoading(true)
    }
    let dataMain = {
      genre_id: genre_id ? genre_id : seriesdata.genre_id,
      sub_genres_id: sub_genre_id.length > 0 ? sub_genre_id.join() : seriesdata.sub_genre_id,
      tag_ids: newTags[0] !== undefined ? `${newTags}` : tags_ids.join(),
      content_type: seriesdata.content_type,
      title: watch('title') ? watch('title') : seriesdata.title,
      description: watch('description') ? watch('description') : seriesdata.description,
      is_mature: watch('is_matured')
    };

    if (slug) {
      dataMain.series_id = seriesdata.id
    }

    if (croppopup.file) {
      dataMain.cover_image = croppopup.file
      dataMain.cover_image_name = croppopup.coverfilename !== null ? croppopup.coverfilename : seriesdata.cover_image_name
    }

    try {
      const response = await axiosRequest({
        sub_url: "/createseries",
        dataMain,
      });
      if (response.status === 200 && e !== 1) {
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/createcontents/${slug}`)
      }
      if (e === 1) {
        setisDisable(false)
        setSavingStatus(false)
        setRequestLoading(false)
      }
      toast.success(<SuccessToast message={response.data.message} />, {
        hideProgressBar: true,
        autoClose: 8000,
      });
    } catch (err) {
      return toast.warning(<SuccessToast message={err.response.data.message} />, {
        hideProgressBar: true,
        autoClose: 8000,
      });
    }
  }
  // form Submit
  const onSubmit = async (data) => {
    handleSave(data)
    // if (tags_ids.length === 0) {
    //   return setError('tag_ids', { type: 'required', message: 'Please select a minimum 1 tag' });
    // }

    // let newTags
    // if(tags_ids.length) { 
    //   newTags = tags_ids.map(item => {
    //     return item.id
    //   })
    // }

    // setRequestLoading(true)
    // let dataMain = {      
    //   genre_id: genre_id ? genre_id : seriesdata.genre_id,
    //   sub_genres_id: sub_genre_id.length > 0 ? sub_genre_id.join() : seriesdata.sub_genre_id,
    //   tag_ids: newTags[0] !== undefined ? `${newTags}` : tags_ids.join(),
    //   content_type: seriesdata.content_type,
    //   title: watch('title') ? watch('title') : seriesdata.title,
    //   description: watch('description') ? watch('description') : seriesdata.description
    // };

    // if(slug) {
    //   dataMain.series_id = seriesdata.id
    // }

    // if(croppopup.file) {
    //   dataMain.cover_image = croppopup.file
    //   dataMain.cover_image_name = croppopup.coverfilename !== null ? croppopup.coverfilename : seriesdata.cover_image_name
    // }

    // try {
    //   const response = await axiosRequest({
    //     sub_url: "/createseries",
    //     dataMain,
    //   });
    //   if (response.status === 200) {
    //     navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/createcontents/${slug}`)
    //   }
    // } catch (err) {
    //   return toast.warning(<SuccessToast message={err.response.data.message} />, {
    //     hideProgressBar: true,
    //     autoClose: 8000,
    //   });
    // }
  };


  if (!loading && seriesdata !== null && tags.length > 0 && genres.length > 0) {
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
                    {(croppopup.coverfilename !== "" && croppopup.coverfilename !== null) ? croppopup.coverfilename : seriesdata.cover_image_name}
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

              {/* Collection title */}
              <Col sm={12}>
                <h4 className="title-create-item">Series Title </h4>
                <input
                  type="text"
                  {...register("title", { required: "true" })}
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
                  {...register("description")}
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
                        matured_content_val === "1"
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
                        matured_content_val === "0"
                          ? "activebtn btnforMature"
                          : "btnforMature"
                      }
                    >No</div>
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

              {Object.keys(filteredGenre).length > 0 && (
                <Col sm={12} className="mt-4">
                  <h4 className="title-create-item">Genre 1</h4>
                  <Select
                    {...register("genre_id")}
                    defaultValue={filteredGenre}
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
              <Col sm={12} className="mt-4">
                <h4 className="title-create-item">Genres 2</h4>
                <Select
                  isMulti
                  isClearable={false}
                  {...register("sub_genres_id")}
                  defaultValue={filterSubGenre}
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


              {/* Secondry Genre */}

              {/* Tags Input */}
              {Object.keys(filteredTags).length > 0 &&
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
                    defaultValue={filteredTags}
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
                </Col>}

              {/* Tags Input */}

              <Col sm={12} className="text-right">
                    <div class="button-wrapper d-flex justify-content-end align-items-center text_size3">
                    <button className="PrimaryBtn mt-5 mr-2" type="button" onClick={() => { handleSave(1) }}>{SavingStatus ? 'Saving...' : 'Save'}</button>
                    <button className="PrimaryBtn mt-5 ml-2" type="submit" disabled={isDisable}> {isDisable === false ? requestLoading ? 'Uploading...' : 'Continue to upload' : 'Continue to upload'}  </button>
                    </div>
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
              cover_image: croppopup.file ? croppopup.file : seriesdata.cover_image,
              genre_id: genre_id ? genre_id : seriesdata.genre_id,
              sub_genres_id: sub_genre_id.length > 0 ? sub_genre_id.join() : seriesdata.sub_genres_id,
              tag_ids: tags_ids.length > 0 ? tags_ids.join() : seriesdata.tag_ids,
              is_matured: matured_content_val ? matured_content_val : seriesdata.is_mature,
              tagsSelected: filteredTags
            }}
          />
        )}

      </div>
    );
  } else {
    return null
  }
};

export default EditSeriesFrom;
