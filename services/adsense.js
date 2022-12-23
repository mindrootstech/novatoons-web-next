import React, { useEffect } from 'react';


const AdSense = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    return (
        <ins className="adsbygoogle"
            style={{display: "block"}}
            data-ad-client="ca-pub-7031631451622714"
            data-ad-slot="1494517986"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    )
}

export default AdSense