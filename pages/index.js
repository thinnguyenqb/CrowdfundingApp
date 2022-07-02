import { useEffect } from 'react';
import CardSlider from '../components/CardSlider';
import Hero from '../components/Hero';
import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <Hero />
            <CardSlider />
        </Layout>
    );
}