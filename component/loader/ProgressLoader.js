import React, { Fragment, useEffect, useState } from 'react';
import { Progress, Modal, Container, Row, Col, ModalBody, ModalHeader } from 'reactstrap';
import { useSelector } from 'react-redux';
import './loader.scss';
import './loader.css'

const ProgressLoader = () => {
    const [centeredModal, setCenteredModal] = useState(true)
    const { progress, processing } = useSelector(state => state.commonReducer)

    useEffect(()=>{
        if(processing) {
            setCenteredModal(true)
        }
        if(progress === 100 || progress === "100") {
            setCenteredModal(false)
        }
    }, [progress])

    return (

        <Fragment>
            <Modal isOpen={centeredModal} toggle={() => { setCenteredModal(!centeredModal) }} className='modal-dialog-centered progressBarLoader'>
                <ModalHeader className='bgDarkTransparent' toggle={() => { setCenteredModal(!centeredModal) }}>
                </ModalHeader>
                <ModalBody className='ProgressModel'>
                    <Container>
                        <Row>
                            <Col className='m-auto' sm={6}>
                                <Progress color="success" value={progress} />
                                <p className='text-center mt-2'>{progress}%</p>
                                <p className='text-center mt-5'>Files Uploading...</p>
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default ProgressLoader;
