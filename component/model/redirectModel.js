import React, { Fragment, useEffect } from 'react'
import { Row, Modal, ModalBody } from 'reactstrap';
// import { Link, useNavigate } from 'react-router-dom';

//redux
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// import { redirectToHomeModel } from '../../redux/modelReducer';

const RedirectModel = () => {
    // const navigate = useNavigate()
    // const dispatch = useDispatch()
    // const { redirectToHome } = useSelector(state => state.modelReducer)

    const handleRedirect = () => {
        // dispatch(
        //     redirectToHomeModel(false)
        // )
    }

    useEffect(()=>{
        setTimeout(()=>{
            // dispatch(
            //     redirectToHomeModel(false)
            // )
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
        }, 5000)
    },[])
const redirectToHome = true
    return (
        <Fragment>
            <Modal
                isOpen={redirectToHome}
                className='modal-dialog-centered'>

                <ModalBody className='ContentTypeModel redirectModel'>
                    <Row>
                        <p className='redirectMessage'>Thanks for submitting your content. Upload takes around couple of minutes so in the meantime you are free to navigate the platform. Once the upload is completed you will be notified here.</p>
                        <div className='w-100 text-center'>
                            <div className='sc-button backToHome header-slider style style-1 fl-button pri-1' onClick={handleRedirect}>
                                <Link className='text-white' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`}>Go to Home</Link>
                            </div>
                        </div>
                    </Row>
                </ModalBody>
                
            </Modal>
        </Fragment>
    )
}

export default RedirectModel