import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import CardSlider from '../components/CardSlider';
import Layout from '../components/Layout';

export default function Home() {
    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <Layout>
            <Hero />
            <CardSlider />
        </Layout>
    );
}