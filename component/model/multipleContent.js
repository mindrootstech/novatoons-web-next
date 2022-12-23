import React, { Fragment, useEffect, useState } from "react";
//img
import free from "../../assets/images/contentImages/free.svg";
import paid from "../../assets/images/contentImages/paid.svg";
import download from "../../assets/images/contentImages/download.svg";
import placeholder from "../../assets/images/contentImages/placeholder.png";

import { axiosRequest } from "../../http";

//third-party
import * as yup from "yup";
import {
  Col,
  Row,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";

//redux
import { useDispatch, useSelector } from "react-redux";
import { seriesContentModel } from "../../redux/modelReducer";
import { setNewSeriesContent } from "../../pages/content/editContentSeriesReducer";

import CreateQueContent from "../../http/createQueContent";

// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

const MultipleContent = ({ seriesdata, index, singleContent }) => {
  const {
    series: { seriesContent },
  } = useSelector((state) => state.editSeriesReducer);
  const { userData } = useSelector((state) => state.userReducer);

  const { seriesContentShow } = useSelector((state) => state.modelReducer);

  const dispatch = useDispatch();

  const [cover_image, setCover_image] = useState(null);
  const [cover_image_name, setCover_image_name] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 270,
    height: 400,
  });
  const [placeholderImg, setPlaceholderImg] = useState(placeholder);
  const [cropedView, setCropedView] = useState(false);
  const [is_downloadable, setIs_downloadable] = useState(false);

  useEffect(() => {
    if (seriesContentShow.show) {
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100vh";
      return () => {
        document.body.style.height = "auto";
        document.body.style.overflowY = "unset";
      };
    }
  }, [seriesContentShow]);

  const createSeriesSchema = yup.object().shape({
    title: yup.string().required(),
    is_paid: yup.string().required(),
    price: yup.number().when("is_paid", (is_paid, createContentSchema) => {
      return is_paid === "1" ? createContentSchema.min(2) : createContentSchema;
    }),
    is_agree: yup.bool().oneOf([true]).required(),
    ...(!singleContent.cover_image && {
      cover_image: yup
        .mixed()
        .test("required", "You need to provide a file", (value) => {
          if (value && value.length > 0) {
            return true;
          }
          return false;
        })
        .test(
          "fileSize",
          "The file is too large (Max-limit is 150mb)",
          (value) => {
            if (value && value.length > 0) {
              return value && value[0].size <= 150000000;
            }
            return true;
          }
        )
        .test(
          "type",
          "The file format should be the jpeg, png, jpg only",
          (value) => {
            if (value && value.length > 0) {
              return (
                value &&
                (value[0].type === "image/jpg" ||
                  value[0].type === "image/png" ||
                  value[0].type === "image/jpeg")
              );
            }
            return false;
          }
        ),
    }),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    watch,
  } = useForm({ mode: "onChange", resolver: yupResolver(createSeriesSchema) });

  useEffect(() => {
    if (Object.keys(singleContent).length > 0) {
      reset({
        ...singleContent,
        is_agree:
          singleContent.is_agree === 1 || singleContent.is_agree === "1"
            ? true
            : false,
        is_paid: singleContent.is_paid
          ? JSON.stringify(singleContent.is_paid)
          : "0",
        price:
          singleContent.is_paid === "1" || singleContent.is_paid === 1
            ? singleContent.price
            : 0,
        is_available:
          singleContent.is_available === "1" || singleContent.is_available === 1
            ? true
            : false,
        is_downloadable:
          singleContent.is_downloadable === 1 ||
          singleContent.is_downloadable === "1"
            ? true
            : false,
      });
      if (
        singleContent.is_downloadable === 1 ||
        singleContent.is_downloadable === "1"
      ) {
        setIs_downloadable(true);
      }
    }
  }, [singleContent]);

  const someDispatch = (dataMain) => {
    dispatch(
      seriesContentModel({
        show: false,
        index: null,
      })
    );
    dispatch(
      setNewSeriesContent({
        index,
        data: dataMain,
      })
    );
  };

  const updateSeq = async (static_id, newid) => {
    let seq = [];

    await new Promise((resolve, reject) => {
      seriesContent.forEach((item, index) => {
        if (item.static_id && item.static_id === static_id) {
          seq.push(parseInt(newid));
        } else {
          if (item.id) {
            seq.push(parseInt(item.id));
          }
        }
        if (index === seriesContent.length - 1) resolve();
      });
    });

    try {
      await axiosRequest({
        sub_url: "/updateseriessequence",
        dataMain: { seriesSequence: seq.join(), series_id: seriesdata.id },
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  const onSubmit = async (data) => {
    const dataMain = {
      ...data,
      cover_image: cover_image ? cover_image : singleContent.cover_image,
      cover_image_name: cover_image_name
        ? cover_image_name
        : singleContent.cover_image_name,
      is_agree: watch("is_agree") ? 1 : 0,
      is_downloadable: is_downloadable ? 1 : 0,
      is_paid: watch("is_paid") === "0" ? 0 : 1,
      series_id: seriesdata.id,
      is_available: watch("is_available") ? 1 : 0,
      tag_ids: seriesdata !== null && seriesdata.tag_ids,
      content_type: seriesdata.content_type,
      genre_id: seriesdata !== null && seriesdata.genre_id,
      sub_genres_id: seriesdata.sub_genre_id,
      file: singleContent.file,
      price: data.price ? data.price : 0,
      original_file: singleContent.original_file,
      newContent: true,
      validData: true,
      static_id: singleContent.static_id,
    };

    if (seriesContentShow.index === seriesContent.length - 1) {
      dataMain.lastContent = true;
      someDispatch(dataMain);
    } else {
      try {
        someDispatch(dataMain);

        const response = await CreateQueContent(
          dataMain,
          dispatch,
          singleContent.static_id,
          singleContent
        );
        if (response.status === 200) {
          updateSeq(singleContent.static_id, response.data.body.id);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // image sectin
  const uploadImage = (e, type) => {
    if (type === "uploadCover") {
      const uplaodfile = e.target.files[0];
      setCover_image_name(uplaodfile.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const upload_File = reader.result;
        //get dimention
        var img = new Image();
        img.src = upload_File;
        img.onload = function () {
          if (img.height !== 400 && img.width !== 270) {
            return setError("cover_image", {
              type: "manual",
              message:
                "Image size must be 270x400(px) and less than 2MB",
            });
          }
        };

        setCover_image(upload_File);
        setCropedView(true);
      };
      reader.readAsDataURL(uplaodfile);
    }
  };

  // function getCroppedimage() {
  //   const canvas = document.createElement("canvas");
  //   canvas.width = crop.width;
  //   canvas.height = crop.height;
  //   const ctx = canvas.getContext("2d");

  //   const cuttingRatio = (crop.width * 100) / image.target.width;
  //   const cuttingR = (crop.height * 100) / image.target.height;
  //   const scaleWidth = (crop.x * 100) / image.target.width;
  //   const scaleHeight = (crop.y * 100) / image.target.height;

  //   const cuttingWidth = (image.target.naturalWidth / 100) * cuttingRatio;
  //   const cuttingHeight = (image.target.naturalHeight / 100) * cuttingR;
  //   const fromLeft = (image.target.naturalWidth / 100) * scaleWidth;
  //   const fromTop = (image.target.naturalHeight / 100) * scaleHeight;

  //   ctx.drawImage(
  //     image.target,
  //     fromLeft,
  //     fromTop,
  //     cuttingWidth,
  //     cuttingHeight,
  //     0, //left
  //     0,
  //     crop.width,
  //     crop.height
  //   );

  //   const imagecrop = canvas.toDataURL("images/jpeg");
  //   setCover_image(imagecrop);
  //   setPlaceholderImg(imagecrop);
  //   setCropedView(false);
  // }

  const handleClose = () => {
    dispatch(
      seriesContentModel({
        show: false,
        index: null,
      })
    );
    if (seriesContentShow.index !== seriesContent.length - 1) {
      onSubmit();
    }
  };

  return (
    <Fragment>
      <Modal
        fullscreen="xl"
        isOpen={seriesContentShow}
        toggle={handleClose}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={handleClose}></ModalHeader>
        <ModalBody className="ContentTypeModel">
          <form id="multiple" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col className="mb-5" sm={12}>
                <h2 className="text-center">
                  Upload
                  {seriesdata.content_type === 1
                    ? " Comic "
                    : seriesdata.content_type === 2
                    ? " Art "
                    : " E-Book "}
                  Details
                </h2>
              </Col>
              <Col md={5}>
                <div className="imgPopupCrop">
                  <img
                    className="w-100"
                    alt="novatoons"
                    src={
                      singleContent.cover_image !== null
                        ? singleContent.cover_image
                        : cover_image !== null
                        ? cover_image
                        : placeholder
                    }
                  />
                  {/* {cropedView !== false ? (
                    <Fragment>
                      <ReactCrop
                        crop={crop}
                        aspect={29 / 22}
                        onChange={(c) => {
                          setCrop(c);
                        }}
                      >
                        <img
                          src={cover_image}
                          onLoad={setImage}
                          alt="novatoons"
                        />
                      </ReactCrop>
                      <button
                        type="button"
                        className="submit m-auto CropingBtn"
                        onClick={getCroppedimage}
                      >
                        Crop
                      </button>
                    </Fragment>
                  ) : (
                    <img
                      className="w-100"
                      alt="novatoons"
                      src={
                        singleContent.cover_image !== null
                          ? singleContent.cover_image
                          : cover_image !== null ? cover_image : placeholder
                      }
                    />
                  )} */}
                </div>
              </Col>

              <Col md={7}>
                <Row>
                  <Col xs={12}>
                    <h4 className="title-create-item">
                      Upload
                      {seriesdata.content_type === 1
                        ? " Comic "
                        : seriesdata.content_type === 2
                        ? " Art "
                        : " E-Book "}
                      Cover
                    </h4>
                    <label
                      className={classnames("uploadFile", {
                        "is-invalid": errors?.cover_image,
                      })}
                    >
                      <div className="filename thumbFile">
                        {cover_image_name
                          ? cover_image_name
                          : singleContent.cover_image_name
                          ? singleContent.cover_image_name
                          : "Please upload image (jpeg, jpg, png) upto 2 mb in size (Dimension = width 270px and height 400px)"}
                      </div>
                      <div className="upload-btn-wrapper">
                        <div className="designedBtn">Select file</div>
                        <input
                          type="file"
                          id="file"
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
                  <Col className="mt-2" sm={12}>
                    <h4 className="title-create-item">Title</h4>
                    <input
                      type="text"
                      {...register("title", { required: "true" })}
                      placeholder="Item name"
                      className={classnames("input", {
                        "is-invalid": errors?.title,
                      })}
                    />
                    {errors?.title && (
                      <FormFeedback className="mb-4">
                        {errors?.title.message}
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
              </Col>

              <Col className="mt-3" sm={12}>
                <h4 className="title-create-item">Description</h4>
                <textarea
                  className="textAreaField"
                  {...register("description", { required: true })}
                  placeholder="e.g. “This is very limited item”"
                ></textarea>
              </Col>

              <Col sm={12}>
                <Row>
                  <Col className="mb-2" xxl={4} xl={6}>
                    <input
                      type="radio"
                      {...register("is_paid")}
                      className="isPaidOrFree"
                      value="0"
                    />
                    <div
                      className={
                        watch("is_paid") === "0"
                          ? "activebtn btnforPaid"
                          : "btnforPaid"
                      }
                    >
                      <img
                        className="imgTabs smallIcon"
                        src={free}
                        alt="free"
                      />
                      Free to Read
                    </div>
                  </Col>

                  <Col className="mb-2" xxl={4} xl={6}>
                    <input
                      type="radio"
                      {...register("is_paid")}
                      className="isPaidOrFree"
                      value="1"
                    />
                    <div
                      className={
                        watch("is_paid") === "1"
                          ? "activebtn btnforPaid"
                          : "btnforPaid"
                      }
                    >
                      <img
                        className="imgTabs smallIcon"
                        src={paid}
                        alt="free"
                      />
                      Purchase
                    </div>
                  </Col>

                  <Col sm={12}>
                    {errors?.is_paid && (
                      <FormFeedback className="mb-4">
                        Please select content is paid or free
                      </FormFeedback>
                    )}
                  </Col>
                </Row>
              </Col>

              <Col className="my-2" xs={12}>
                <input
                  type="checkbox"
                  className="isPaidOrFree"
                  {...register("is_downloadable")}
                  name="availableForDownload"
                  onChange={(e) => {
                    setIs_downloadable(e.target.checked);
                  }}
                />
                <div
                  className={
                    is_downloadable ? "activebtn btnforPaid" : "btnforPaid"
                  }
                >
                  <img className="imgTabs" src={download} alt="free" />
                  Available for Download
                </div>
              </Col>

              {watch("is_paid") === "1" && (
                <Col className="mt-4 priceInput" sm={12}>
                  <h4 className="title-create-item">
                    Price (USD)
                    <i
                      className="fa fa-question-circle ml-3"
                      aria-hidden="true"
                    >
                      <div className="tooltiptext second">
                        Platform Fees : {userData.owner_fee}%
                      </div>
                    </i>
                  </h4>
                  <input
                    type="number"
                    {...register("price", { required: true, min: 1 })}
                    placeholder="Enter Price"
                    onWheel={(e) => e.target.blur()}
                    className={classnames("input", {
                      "is-invalid": errors?.price,
                    })}
                    onFocus={(e) => {
                      e.target.value = "";
                    }}
                  />

                  {parseInt(watch("price")) > 1 ? (
                    <div className="PlatformInfo">
                      You will receive $
                      {parseFloat(
                        watch("price") -
                          (parseFloat(watch("price")) / 100) *
                            parseFloat(userData.owner_fee)
                      ).toFixed(2)}
                      , when user purchases the content.
                    </div>
                  ) : null}

                  {errors?.price && (
                    <FormFeedback className="mb-4">
                      Please enter a valid Price(*Note - minimum value need to
                      be $2*)
                    </FormFeedback>
                  )}
                </Col>
              )}

              {/* <Col className="mt-2" sm={12}>
                <h4 className="title-create-item mb-0 mt-1">Revenue sharing</h4>
                <div className="switchbtn">
                  <Row className="alignItemEnd">
                    <Col className="lableSwitch" xs={8} xl={6} xxl={4}>
                      Available for subscribed users
                    </Col>
                    <Col xl={6} xs={4} xxl={8}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          className="react-switch-checkbox"
                          id={`react-switch-new`}
                          {...register("is_available")}
                        />
                        <span className="slider round"></span>
                      </label>
                    </Col>
                  </Row>
                </div>
                <p className="switchBottom mt-4">
                  Enabling this option would allow subscribed platform users to
                  view the content. You will receive a percentage of revenue
                  based on page views.
                </p>
              </Col> */}

              {/* I Agree */}
              <Col sm={12} className="mt-4">
                <input
                  id="is_agree"
                  type="checkbox"
                  className="d-inline mb-2"
                  {...register("is_agree", { required: true })}
                />
                <label className="termsLable d-inline" htmlFor="is_agree">
                  I agree that I have the rights and/or permission to upload the
                  work and if infringing on any rights, I agree my account can
                  be blocked and all payments withheld permanently.
                </label>
                {errors?.is_agree && (
                  <FormFeedback className="mb-4 mt-2">
                    Please agree to legal terms
                  </FormFeedback>
                )}
              </Col>

              <Col className="doneBtn mt-4" sm={12}>
                <button className="createButton" type="submit">
                  Done
                </button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default MultipleContent;
