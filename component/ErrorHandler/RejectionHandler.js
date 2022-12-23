import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
// import './error.css'
const RejectionHandler = (props) => {
    const logo = '/images/errorpage/logo.png'
    const router = useRouter()
    const refreshPage = () => {
        router.reload()
    }
    return (
        <Fragment>
            <section className="commingSoonSection">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="fullView">
                                <div className="row">
                                    <div className="text-align-center col-sm-12">
                                        <img loading='lazy' className="logoImage" src={logo} alt="" />
                                    </div>

                                    <div className="text-align-center col-sm-12">
                                        <p className="white dummy">{props.data}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='sc-button backToHome header-slider style style-1 mr-4 fl-button pri-1 cursorPointer' onClick={refreshPage}>Refresh</div>

                                    <Link className='sc-button backToHome header-slider style style-1 fl-button pri-1' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`}>Go to Home</Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default RejectionHandler