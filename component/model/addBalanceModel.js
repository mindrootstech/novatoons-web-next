import React, { Fragment, useEffect, useState } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
// import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
//third-party
import { toast } from 'react-toastify'
import Loader from '../../component/loader/loader'

import { addBalancePopoup, Getcreditpackages, selectPackage } from '../../redux/creditReducer'
import { useRouter } from 'next/router';

//fakedata
import { user, plans as plan } from '../../assets/fake-data/fake-user'

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



const AddBalance = () => {

    // const navigate = useNavigate()
    const dispatch = useDispatch()
    // const params = useParams()
    const router = useRouter()
    const params = router.query
    const [package_id, setPackage_id] = useState(0)
    const [creditAmount, setCreditAmount] = useState("")
    const { credits, show, loading } = useSelector(state => state.creditReducer)
    const { userData } = useSelector(state => state.userReducer)

    const addBalanceHandle = () => {
        if(package_id === 0) {
            toast.success(<SuccessToast message={"Please select Credits"} />, { hideProgressBar: true,  autoClose:  8000, })
        } else {
            dispatch(
                selectPackage(package_id)
            )
            dispatch(
                addBalancePopoup({
                    showHide: false
                })
            )
        router.push(`/payment-method?paymenttype=2&package=${package_id}`)
            // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/payment-method?paymenttype=2&package=${package_id}`)   
        }

    }

    useEffect(() => {
        dispatch(
            Getcreditpackages()
        )
    }, [dispatch])

    if(loading && credits.plans.length === 0) {
        return <Loader/>
    } else {
    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={show}
                toggle={() =>
                    dispatch(
                        addBalancePopoup({
                            showHide: false
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            addBalancePopoup({
                                showHide: false
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel addBalanceModel'>
                    <Row>
                        <Col sm={12} className='py-3'><h2 className='text-center'>Add balance</h2></Col>
                        <Col sm={12} md={10} className='m-auto'>
                            <div className='AddBalanceCard mt-3' id={package_id === 0 && "mb50"}>
                                <div className='balanceShow'>
                                    {parseInt(userData.total_credits) < 10.00 && <span className='lowBalanceWaring'></span>}
                                    <span className='viewBalance'>{`${Math.abs(parseFloat(userData.total_credits))}`} </span>
                                    <span className='crName'>Cr / </span>
                                    <span className='viewBalance'>{userData.total_amount} </span>
                                    <span className='crName'>USD </span>
                                </div>
                                <div className='fixedSelect'>
                                    <h5>Choose credit plan </h5>
                                    <div className='fixedBalanceRadio'>
                                        <Row>
                                            <Col sm={12}>
                                                {credits.plans.map((item, index)=> { 
                                                return item.status === 1 ?
                                                    <div className="my-2 mr-2 balanceBtn">
                                                    <p className='balance_btn'>{item.name}</p>
                                                    <input
                                                        id={index}
                                                        type="radio"
                                                        name='valueBalance'
                                                        className="isPaidOrFree"
                                                        value={item.credits}
                                                        onClick={() => {
                                                            setPackage_id(item.id)
                                                            setCreditAmount(item.cost)
                                                        }}
                                                    /> 
                                                    
                                                    <div className={package_id === item.id ? "btnforPaid BalanceRadio activeBalance" : "btnforPaid BalanceRadio"}> {item.credits} Cr. </div>
                                                </div> 
                                                    : ''

                                                })}
                                                {creditAmount && 
                                                <p className='info_para para_2'>You will need to pay ${parseFloat(creditAmount)} for the selected credit.</p> }
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {package_id !== 0 &&
                            <Col sm={12} md={10} className='m-auto'>
                                <div onClick={addBalanceHandle} className='cursorPointer addBalanceDone'> Done </div>
                            </Col>
                        }
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    ) }
}

export default AddBalance