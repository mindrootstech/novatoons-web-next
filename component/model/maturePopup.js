import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { axiosRequest } from '../../http';

//redux
import { mutureModelToggle, resetSwitch } from '../../redux/modelReducer';
import { useDispatch, useSelector } from 'react-redux';
import {setUserData} from '../../redux/userReducer'
import { filteration } from "../../helpers/filteration";

import { toast } from 'react-toastify'
function SuccessToast({ message }) {
    return (
        <Fragment>
            <div className='toastify-header'>
                <div className='title-wrapper'>
                    <h6 className='toast-title'>{message}</h6>
                </div>
            </div>
        </Fragment>
    )
}

const MaturePopup = () => {
const eighteenPlus = '/images/errorpage/eighteenplus.svg'

    const dispatch = useDispatch()
    const {mutureModel} = useSelector(state => state.modelReducer)
    const {userData} = useSelector(state => state.userReducer)

    const handleSubmit = async (value) => {
        if(value === "0") {
            dispatch(
                mutureModelToggle(false)
            )
            dispatch(resetSwitch(false))
                if(userData.is_mature === "0"){
                  const change_type ={
                    filterType: "Audience",
                filterKey: 1,
                append: false
                  }
                  filteration(dispatch, change_type);
                
                }
        } else {
        const dataMain = {is_mature : (value ? value : "") }
        try {
            const response = await axiosRequest({sub_url: '/updateprofile', dataMain})
            if(response.status === 200) {
                dispatch(
                    setUserData(response.data.body.profile)
                )
                if (localStorage.getItem('userData')){
                    localStorage.setItem('userData', JSON.stringify(response.data.body.profile))
                } else {
                    sessionStorage.setItem('userData', JSON.stringify(response.data.body.profile))
                }
                dispatch(
                    mutureModelToggle(false)
                )
                return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        } catch (err) {
            return toast.success(<SuccessToast message={err.response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }
    }
    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={mutureModel}
                toggle={() => { 
                    dispatch(
                        mutureModelToggle(false)
                    )
                    if(userData.is_mature !== "1") {
                        dispatch(resetSwitch(false))
                        if(userData.is_mature === "0"){
                            const change_type ={
                              filterType: "Audience",
                          filterKey: 1,
                          append: false
                            }
                            filteration(dispatch, change_type)
                          
                          }
                    }
                }}
                className='modal-dialog-centered'
            >
                <ModalHeader toggle={() => { 
                    dispatch(
                        mutureModelToggle(false)
                    )
                    if(userData.is_mature !== "1") {
                        dispatch(resetSwitch(false))
                        if(userData.is_mature === "0"){
                            const change_type ={
                              filterType: "Audience",
                          filterKey: 1,
                          append: false
                            }
                            filteration(dispatch, change_type)
                          
                          }
                    }
                }}>
                </ModalHeader>
                <ModalBody className='matureModel'>
                    <Row>
                        <Col sm={12} className='mb-4 text-center'>
                            <img className='MatureIcon' src={eighteenPlus} alt="mature" />
                        </Col>
                        <Col sm={12} className='mb-4'>
                            <h3>Are you 18 years old or above ?</h3>
                            <h3 className='subTitlemature'>You must be 18+ years to view mature content on the platform.</h3>
                        </Col>
                        <Col className="mb-2" sm={6}>
                            <input
                                type="radio"
                                name='is_mature'
                                className="isPaidOrFree"
                                value="0"
                                onChange={(e) =>{ 
                                    handleSubmit(e.target.value)}}
                            />
                            <div className="btnforPaid">
                                No 
                            </div>
                        </Col>
                        <Col className="mb-2" sm={6}>
                            <input
                                type="radio"
                                name='is_mature'
                                className="isPaidOrFree"
                                value="1"
                                onChange={(e) => handleSubmit(e.target.value)}
                            />
                            <div className="btnforPaid">
                                <div className="matureText"> Yes</div>
                            </div>
                        </Col>
                       
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default MaturePopup