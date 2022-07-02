import {
    useColorModeValue,
    Text,
    Flex,
    Box,
    Img,
    Tooltip,
    Stack,
    Progress,
    Avatar
} from '@chakra-ui/react';
import { BiTime } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import NextLink from 'next/link';
import { getWEIPriceInUSD } from '../lib/getETHPrice.js';
import web3 from '../smart-contract/web3';

export default function CampaignCard({ name, description, creatorId, imageURL, id, balance, target, ethPrice }) {
    return (
        <NextLink href={`/campaign/${id}`}>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW={{ md: 'sm' }}
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                transition={'transform 0.3s ease'}
                _hover={{
                    transform: 'translateY(-8px)'
                }}>
                <Box height="12em">
                    <Img
                        src={imageURL}
                        alt={`Picture of ${name}`}
                        roundedTop="lg"
                        objectFit="cover"
                        w="full"
                        h="full"
                        display="block"
                    />
                </Box>
                <Box p="4">
                    <Stack mt={2} direction={'row'} spacing={4} align={'center'}>
                        <Avatar
                            size="sm"
                            src={'https://cdn3.iconfinder.com/data/icons/luchesa-vol-9/128/Purse-1024.png'}
                            alt={'Author'}
                        />
                        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                            <Tooltip
                                label={creatorId}
                                bg={useColorModeValue('white', 'gray.700')}
                                placement={'top'}
                                color={useColorModeValue('gray.800', 'white')}
                                fontSize={'1em'}>
                                <Text
                                    width={200}
                                    fontWeight={600}
                                    color={'gray.500'}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis">
                                    by {creatorId}
                                </Text>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    <Flex mt="2" justifyContent="space-between" alignContent="center" pt={2}>
                        <Box
                            fontSize="xl"
                            fontWeight="semibold"
                            color="orange.600"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                            noOfLines={1}>
                            {name}
                        </Box>
                    </Flex>
                    <Flex justifyContent="space-between" alignContent="center">
                        <Box
                            fontSize="sm"
                            fontWeight="normal"
                            as="h4"
                            lineHeight="tight"
                            height="4.5em"
                            isTruncated
                            noOfLines={3}>
                            {description}
                        </Box>
                    </Flex>

                    <Flex direction="row" py={2}>
                        <Box w="full">
                            <Box fontSize={'xl'} isTruncated maxW={{ base: '	15rem', sm: 'sm' }} pt="2">
                                <Text as="span" fontWeight={'bold'} noOfLines={1}>
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
                                    (${getWEIPriceInUSD(ethPrice, balance)})
                                </Text>
                            </Box>

                            <Text fontSize={'md'} fontWeight="normal">
                                target of {web3.utils.fromWei(target, 'ether')} ETH ($
                                {getWEIPriceInUSD(ethPrice, target)})
                            </Text>
                            <Progress
                                borderRadius={5}
                                colorScheme="orange.600"
                                size="sm"
                                value={web3.utils.fromWei(balance, 'ether')}
                                max={web3.utils.fromWei(target, 'ether')}
                                mt="2"
                            />
                        </Box>{' '}
                    </Flex>
                    <Flex justifyContent="space-between" mt={2} color={'gray.500'}>
                        <Flex flex="row" justifyContent="center" alignItems="center">
                            <BiTime />
                            <Text ml={2} fontSize="sm">
                                <span> 0 week left</span>
                            </Text>
                        </Flex>

                        <Flex flex="row" justifyContent="center" alignItems="center">
                            <FaHeart />
                            <Text ml={2} fontSize="sm">
                                <span>0</span> Supporters
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </NextLink>
    );
}
