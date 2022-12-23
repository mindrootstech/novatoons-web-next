import React from 'react';
// import './loader.scss';

const Loader = () => {
const logo ='/images/logo/logo.png'

    return (
        <>
            <div>
            </div>
            <div className='fallback-spinner windowScroller'>
                <img src={logo} alt="novatoons"/>
                <div className='loading component-loader'>
                    <div className='effect-1 effects'></div>
                    <div className='effect-2 effects'></div>
                    <div className='effect-3 effects'></div>
                </div>
            </div>
        </>
    );
};

export default Loader;
