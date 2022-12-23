import React, {useEffect} from "react";
import Header from "../Header";
import Footer from "../Footer";

const Layout = ({children}) => {

  useEffect( () => { 
    document.querySelector("body").classList.add("is_dark") 
  }, [] );

  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  );
};

export default Layout;
