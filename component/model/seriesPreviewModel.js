import React, { Fragment } from "react";
import { Col, Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import PreviewSeriesCard from "../previewSeriesCard";
//redux
import { useDispatch, useSelector } from "react-redux";
// import { seriesPreview } from "../../redux/modelReducer";

const SeriesPreviewModel = ({previewData}) => {
  // const dispatch = useDispatch();
  // const { seriesPreviewData } = useSelector((state) => state.modelReducer);
const seriesPreviewData = { show: false}
  return (
    <Fragment>
      <Modal
        fullscreen="xl"
        isOpen={seriesPreviewData.show}
        toggle={() => {
          dispatch(
            seriesPreview({
                show: false,
                data: {}
            })
            );
        }}
        className="modal-dialog-centered previewModel"
      >
        <ModalHeader
          toggle={() => {
            dispatch(
                seriesPreview({
                    show: false,
                    data: {}
                })
            );
          }}
        ></ModalHeader>
        <ModalBody className="ContentTypeModel">
          <Row className="scrolledView">
            <Col sm={12}>
              <h2 className="mb-5 modelHeading text-center">Preview Item</h2>
            </Col>
            <Col sm={12}>
              <Row className="previewItemPopUp">
                <PreviewSeriesCard previewData={previewData} />
              </Row>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default SeriesPreviewModel;
