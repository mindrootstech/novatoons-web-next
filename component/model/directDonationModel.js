import React, { Fragment } from 'react'
import { Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutFormMain from '../CheckoutForm';

import {makeDirectDonation} from '../../redux/modelReducer'


const DirectDonationModel = () => {
    const dispatch = useDispatch()
    const {directDonation} = useSelector(state => state.modelReducer)

    return (
        <Fragment>
            <Modal 
            isOpen={directDonation.show} 
            toggle={() => 
                dispatch(
                    makeDirectDonation({
                        show: false,
                        amount: null,
                        user_id: null
                    })
                )
            } 
            className='modal-dialog-centered'>
                <ModalHeader 
                toggle={() => 
                    dispatch(
                        makeDirectDonation({
                            show: false,
                            amount: null,
                            user_id: null
                        })
                    )
                }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel directDonation'>
                        <Row className='scrolledView'>
                            <CheckoutFormMain isBalanceLow={true}/>
                        </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default DirectDonationModel