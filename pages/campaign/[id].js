import { Box, Container, Heading, HStack, Stack } from '@chakra-ui/layout';
import Campaign from '../../smart-contract/campaign';
import CampaignerCard from '../../components/CampaignerCard';
import CampaignInfo from '../../components/CampaignInfo';
import CampaignTab from '../../components/CampaignTab';
import Layout from '../../components/Layout';
import SupportersCard from '../../components/SupportersCard';
import { getETHPrice } from '../../lib/getETHPrice';
import Link from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function CampaignDetail({
    id,
    minimumContribution,
    balance,
    requestsCount,
    approversCount,
    manager,
    name,
    description,
    image,
    target,
    ETHPrice
}) {
    return (
        <Layout>
            <Container maxW="container.xl" py={8} mt={20}>
                <Stack spacing={8}>
                    <Heading textAlign="center">{name}</Heading>

                    <HStack spacing={6} alignItems="flex-start">
                        <Box flex={7}>
                            <CampaignTab
                                id={id}
                                campaignId={id}
                                description={description}
                                minimumContribution={minimumContribution}
                                ETHPrice={ETHPrice}
                                requestsCount={requestsCount}
                                approversCount={approversCount}
                                manager={manager}
                                name={name}
                            />
                        </Box>
                        <Stack spacing={8} flex={3}>
                            <CampaignInfo balance={balance} ETHPrice={ETHPrice} target={target}  id={id} campaignId={id}/>
                            <CampaignerCard />
                            <SupportersCard />
                        </Stack>
                    </HStack>
                </Stack>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps(ctx) {
    const campaignId = ctx.params.id;
    const campaign = Campaign(campaignId);
    const summary = await campaign.methods.getSummary().call();
    const ETHPrice = await getETHPrice();

    return {
        props: {
            id: campaignId,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            name: summary[5],
            description: summary[6],
            image: summary[7],
            target: summary[8],
            ETHPrice
        }
    };
}
