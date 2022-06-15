import Slider from 'react-slick';
import Card from './Card';

export default function CardSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 50,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    return (
        <div>
            <Slider {...settings}>
                <div>
                    <Card />
                </div>
                <div>
                    <Card />
                </div>
                <div>
                    <Card />
                </div>
                <div>
                    <Card />
                </div>
                <div>
                    <Card />
                </div>
                <div>
                    <Card />
                </div>
            </Slider>
        </div>
    );
}