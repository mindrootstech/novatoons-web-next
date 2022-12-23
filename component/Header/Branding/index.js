import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const Branding = () => {
  return (
    <>
    <div id="site-logo" className="clearfix">
    <div id="site-logo-inner">
      <Link
        href='/'
        rel="home"
        className="main-logo"
      >
        <Image
            width={100}
            height={55}
            loading='lazy'
            className="logo"
            id="logo_header"
            src='/images/logo/logo_dark.png'
            srcSet='/images/logo/logo_dark@2x.png'
            alt="novatoons-logo"
        />
      </Link>
    </div>
  </div>
    
    </>
    )
}

export default Branding