import img1 from '../images/item-background/bg1.png'
import img2 from '../images/item-background/bg2.png'
import img3 from '../images/item-background/mb.jpg'
import img4 from '../images/item-background/slidermobile.jpg'

const heroSliderData = [
    {
        title_1: "Discover Comics,",
        title_2: "Art",
        title_3: "and Community",
        description: "From Blacks, Africans and People of Color to the WORLD",
        class:'center',
        img: window.innerWidth < 576 ? img3 : img1
    },
    {
        title_1: "Discover Comics,",
        title_2: "Art ",
        title_3: "and Community",
        description: "From Blacks, Africans and People of Color to the WORLD",
        class:'center',
        img: window.innerWidth < 576 ? img4 : img2
    }
]

export default heroSliderData;