import { Button } from '@chakra-ui/button';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { Progress } from '@chakra-ui/progress';
import { useColorModeValue } from '@chakra-ui/react';
import { BiDonateHeart } from 'react-icons/bi';
import { FaFacebook } from 'react-icons/fa';
import { getWEIPriceInUSD } from '../lib/getETHPrice';
import web3 from '../smart-contract/web3';

export default function CampaignInfo({ balance, ETHPrice, target }) {
    return (
        <Stack>
            <Button
                h={16}
                leftIcon={<BiDonateHeart fontSize="30px" />}
                colorScheme="teal"
                variant="solid"
                fontWeight="bold"
                fontSize="lg"
                background="#0fffc8"
                color="#1a202c">
                CONTRIBUTE NOW
            </Button>
            <Button h={14} colorScheme="facebook" leftIcon={<FaFacebook />} fontWeight="bold" fontSize="md">
                Spread the world
            </Button>
            <Box>
                <Box fontSize={'2xl'} isTruncated maxW={{ base: '15rem', sm: 'sm' }} pt="2">
                    <Text as="span" fontWeight={'bold'}>
                        {balance > 0 ? web3.utils.fromWei(balance, 'ether') : '0, Become a Donor 😄'}
                    </Text>
                    <Text as="span" display={balance > 0 ? 'inline' : 'none'} pr={2} fontWeight={'bold'}>
                        {' '}
                        ETH
                    </Text>
                    <Text
                        as="span"
                        fontSize="lg"
                        display={balance > 0 ? 'inline' : 'none'}
                        fontWeight={'normal'}
                        color={useColorModeValue('gray.500', 'gray.200')}>
                        (${getWEIPriceInUSD(ETHPrice, balance)})
                    </Text>
                </Box>

                <Text fontSize="0.9rem" color="#959595eb">
                    target of{' '}
                    <Text as="span" color="#ffffffeb" fontSize="1rem" mx="3px">
                        {web3.utils.fromWei(target, 'ether')} ETH ($
                        {getWEIPriceInUSD(ETHPrice, target)})
                    </Text>
                </Text>
            </Box>
            <Progress
                hasStripe
                value={web3.utils.fromWei(balance, 'ether')}
                max={web3.utils.fromWei(target, 'ether')}
            />
            <Flex justifyContent="space-between">
                <Text fontSize="md">
                    <Text as="span" fontSize="1.3rem" fontWeight="bold">
                        4500
                    </Text>{' '}
                    supporters
                </Text>
                <Text fontSize="md">
                    <Text as="span" fontSize="1.3rem" fontWeight="bold">
                        78
                    </Text>{' '}
                    days left
                </Text>
            </Flex>
        </Stack>
    );
}
