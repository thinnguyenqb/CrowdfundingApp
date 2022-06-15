import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Card from '../components/Card';
import CardSlider from '../components/CardSlider';

export default function Home() {
    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <div>
            <NavBar />
            <Hero />
            <CardSlider />
            <Footer />
        </div>
    );
}