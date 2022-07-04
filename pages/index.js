import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { getETHPrice } from '../lib/getETHPrice.js';
import factory from '../smart-contract/factory';
import Campaign from '../smart-contract/campaign';

import { Heading, Container, SimpleGrid, Divider, Skeleton, SkeletonCircle, HStack } from '@chakra-ui/react';

export async function getServerSideProps(context) {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log(campaigns);

    return {
        props: { campaigns }
    };
}

export default function Home({ campaigns }) {
    const [campaignList, setCampaignList] = useState([]);
    const [ethPrice, updateEthPrice] = useState(null);

    async function getSummary() {
        try {
            const summary = await Promise.all(
                campaigns?.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
            );
            const ETHPrice = await getETHPrice();
            updateEthPrice(ETHPrice);
            console.log('summary ', summary);
            setCampaignList(summary);

            return summary;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getSummary();
    }, []);

    return (
        <Layout>
            <Hero />
            <Container py={{ base: '4', md: '12' }} maxW={'7xl'}>
                <HStack spacing={2}>
                    <SkeletonCircle size="4" />
                    <Heading as="h2" size="lg">
                        Open Campaigns
                    </Heading>
                </HStack>

                <Divider marginTop="4" />
                {campaignList.length > 0 ? (
                    <SimpleGrid columns={4} spacing={10} py={8}>
                        {campaignList
                            .slice(0)
                            .reverse()
                            .map((el, i) => {
                                return (
                                    <div key={i}>
                                        <CampaignCard
                                            name={el[5]}
                                            description={el[6]}
                                            creatorId={el[4]}
                                            imageURL={el[7]}
                                            id={campaigns[i]}
                                            target={el[8]}
                                            balance={el[1]}
                                            ethPrice={ethPrice}
                                        />
                                    </div>
                                );
                            })}
                    </SimpleGrid>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
                        <Skeleton height="25rem" />
                        <Skeleton height="25rem" />
                        <Skeleton height="25rem" />
                    </SimpleGrid>
                )}
            </Container>
        </Layout>
    );
}
