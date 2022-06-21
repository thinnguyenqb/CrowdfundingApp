import { Box, Center, Heading, Text } from '@chakra-ui/layout';
import Slider from 'react-slick';
import Card from './Card';

export default function CardSlider() {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    return (
        <Box w="90%" mx="auto" my={8}>
            <Center flexDirection="column" lineHeight="220%">
                <Heading color="orange.400">Trending Campaigns</Heading>
                <Text color={'gray.500'}>View the fundraisers that are most active right now</Text>
            </Center>
            <Slider {...settings}>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </Slider>
        </Box>
    );
}