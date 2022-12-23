import React from "react";
import Link from 'next/link'

const Mainmenu = () => {
  return (
    <>
      
      <nav
        id="main-nav"
        className="main-nav "
      >
        <ul id="menu-primary-menu" className="menu">
          <li className="menu-item">
            <Link href="/"><span>Home</span></Link>
          </li>
          <li className="menu-item">
            <Link href="/comic"><span>Comic</span></Link>
          </li>
          <li className="menu-item">
            <Link href="/art"><span>Art</span></Link>
          </li>

          <li className="menu-item">
            <Link href="/explore"><span>Explore</span></Link>
          </li>
          
          <li className="menu-item">
            <Link href="/contact"><span>Contact us</span></Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Mainmenu;
