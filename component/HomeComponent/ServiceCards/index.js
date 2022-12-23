import React from 'react';
import icon1 from '../../../public/images/icon/Wallet.png'
import icon2 from '../../../public/images/icon/Category.png'
import icon3 from '../../../public/images/icon/Image2.png'
import icon4 from '../../../public/images/icon/Bookmark.png'

const ServiceCards = () => {
    const data = [
        {
            title: "Set Up Your Wallet",
            description: "Once you’ve set up your wallet of choice, connect it to OpenSeaby clicking the Content Marketplacein the top right corner.",
            icon : icon1,
            colorbg : "icon-color1"
        },
        {
            title: "Create Your Collection",
            description: "Click Create and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.",
            icon : icon2,
            colorbg : "icon-color2",
        },
        {
            title: "Upload Your Content",
            description: "Upload your work (Comic, Art), add a title and description, and customize your content with properties, stats",
            icon : icon3,
            colorbg : "icon-color3",
        },
        {
            title: "List Them For Sale",
            description: "Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your Content!",
            icon : icon4,
            colorbg : "icon-color4",
        },
    ]
    return (
        <section className="tf-box-icon create tf-section bg-home-3">
            <div className="themesflat-container">
                <div className="row">
                    {
                        data.map((item , index) => (
                            <CreateItem key={index} item={item} />
                        ))
                    }
                </div>                 
            </div>
        </section>
    );
}

const CreateItem = props => (
    <div className='col-lg-3 col-md-6 col-12'>
        <div className="sc-box-icon">
        <div className="image center">
            <div className={`icon-create ${props.item.colorbg}`}>
                    <img src={props.item.icon.src} alt="" />
                </div>                                                                           
            </div>
        <h3 className="heading">{props.item.title}</h3>
        <p className="content">{props.item.description}</p>
    </div>
    </div>
    
)

export default ServiceCards;
