import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <div>
            <NavBar />
            <Hero />
            <Card />
            <Footer />
        </div>
    );
}