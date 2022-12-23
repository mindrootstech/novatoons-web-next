import React, { Fragment } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

//component
import CommentView from '../../pages/pdfview/common/comments';

//redux
import { resetSelected , singleCommentShow} from '../../redux/commentsReducer'
import { useDispatch, useSelector } from 'react-redux'
import { commentsModelShow } from '../../redux/modelReducer'


const CommentsModel = ({socket}) => {
    const dispatch = useDispatch()
    const { commentsModel } = useSelector(state => state.modelReducer)

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={commentsModel}
                toggle={() => {
                    dispatch(
                        commentsModelShow(false)
                    )
                    dispatch(singleCommentShow(false))
                    dispatch(resetSelected())
                }   
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() => {
                        dispatch(commentsModelShow(false))
                        dispatch(singleCommentShow(false))
                        dispatch(resetSelected())
                    }
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <CommentView socket={socket} />
                </ModalBody>
            </Modal>
        </Fragment>
    )
}


export default CommentsModel