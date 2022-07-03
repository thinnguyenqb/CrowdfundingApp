import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { SimpleGrid } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { AiFillInfoCircle, AiOutlineLike } from 'react-icons/ai';
import { RiTableFill } from 'react-icons/ri';
import web3 from '../smart-contract/web3';
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from '../lib/getETHPrice';
import {
    Stat,
    StatLabel,
    StatNumber,
    Tooltip,
    useColorModeValue,
    Container,
    Skeleton,
    Stack,
    Heading,
    useBreakpointValue,
    useDisclosure,
    FormControl,
    FormLabel,
    Textarea,
    InputGroup,
    Input,
    InputRightAddon,
    Alert,
    AlertIcon,
    AlertDescription,
    FormHelperText
} from '@chakra-ui/react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/modal';
import { useState } from 'react';
import Campaign from '../smart-contract/campaign';
import { useEffect } from 'react';
import NextImage from 'next/image';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'use-wallet';
import { useAsync } from 'react-use';

function StatsCard(props) {
    const { title, stat, info } = props;
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'sm'}
            border={'1px solid'}
            borderColor={'gray.500'}
            rounded={'lg'}
            transition={'transform 0.3s ease'}
            _hover={{
                transform: 'translateY(-5px)'
            }}>
            <Tooltip
                label={info}
                bg={useColorModeValue('white', 'gray.700')}
                placement={'top'}
                color={useColorModeValue('gray.800', 'white')}
                fontSize={'1em'}>
                <Flex justifyContent={'space-between'}>
                    <Box pl={{ base: 2, md: 4 }}>
                        <StatLabel fontWeight={'medium'} isTruncated>
                            {title}
                        </StatLabel>
                        <StatNumber
                            fontSize={'base'}
                            fontWeight={'bold'}
                            isTruncated
                            maxW={{ base: '	10rem', sm: 'sm' }}>
                            {stat}
                        </StatNumber>
                    </Box>
                </Flex>
            </Tooltip>
        </Stat>
    );
}

export default function CampaignTab({
    id,
    campaignId,
    description,
    minimumContribution,
    ETHPrice,
    requestsCount,
    approversCount,
    manager,
    name
}) {
    const [requestsList, setRequestsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [FundNotAvailable, setFundNotAvailable] = useState(false);
    const campaign = Campaign(id);
    async function getRequests() {
        try {
            const requests = await Promise.all(
                Array(parseInt(requestsCount))
                    .fill()
                    .map((element, index) => {
                        return campaign.methods.requests(index).call();
                    })
            );

            console.log('requests', requests);
            setRequestsList(requests);
            setIsLoading(false);
            return requests;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // if (balance == 0) {
        setFundNotAvailable(true);
        // }
        getRequests();
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const [inUSD, setInUSD] = useState();
    const [error, setError] = useState('');
    const wallet = useWallet();

    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
        reset
    } = useForm({
        mode: 'onChange'
    });

    useAsync(async () => {
        try {
            const result = await getETHPrice();
            setETHPrice(result);
        } catch (error) {
            console.log(error);
        }
    }, []);
    async function onSubmit(data) {
        console.log(data);
        const campaign = Campaign(id);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(data.description, web3.utils.toWei(data.value, 'ether'), data.recipient)
                .send({ from: accounts[0] });

            router.push(`/campaign/${id}/requests`);
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    return (
        <>
            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab>
                        <AiFillInfoCircle /> <Text ml={2}>About</Text>
                    </Tab>
                    <Tab>
                        <RiTableFill /> <Text ml={2}>List of Request</Text>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Text>{description}</Text>
                        <a color="teal.500" href={`https://rinkeby.etherscan.io/address/${id}`} target="_blank">
                            View on Rinkeby Etherscan
                        </a>
                        <SimpleGrid py={5} columns={{ base: 1 }} spacing={{ base: 5 }}>
                            <StatsCard
                                title={'Minimum Contribution'}
                                stat={`${web3.utils.fromWei(minimumContribution, 'ether')} ETH ($${getWEIPriceInUSD(
                                    ETHPrice,
                                    minimumContribution
                                )})`}
                                info={
                                    'You must contribute at least this much in Wei ( 1 ETH = 10 ^ 18 Wei) to become an approver'
                                }
                            />
                            <StatsCard
                                title={'Wallet Address of Campaign Creator'}
                                stat={manager}
                                info={
                                    'The Campaign Creator created the campaign and can create requests to withdraw money.'
                                }
                            />
                            <StatsCard
                                title={'Number of Requests'}
                                stat={requestsCount}
                                info={
                                    'A request tries to withdraw money from the contract. Requests must be approved by approvers'
                                }
                            />
                            <StatsCard
                                title={'Number of Approvers'}
                                stat={approversCount}
                                info={'Number of people who have already donated to this campaign'}
                            />
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        {requestsList.length > 0 ? (
                            <Container px={{ base: '4', md: '12' }} maxW={'7xl'} align={'left'}>
                                <Flex flexDirection={{ base: 'column', lg: 'row' }} py={4}>
                                    <Box py="2" pr="2">
                                        <Heading
                                            textAlign={useBreakpointValue({ base: 'left' })}
                                            fontFamily={'heading'}
                                            color={useColorModeValue('gray.800', 'white')}
                                            as="h3"
                                            isTruncated
                                            maxW={'3xl'}>
                                            Withdrawal Requests for {name} Campaign
                                        </Heading>
                                    </Box>
                                    <Spacer />
                                    <Box py="2">
                                        <Button
                                            display={{ sm: 'inline-flex' }}
                                            justify={'flex-end'}
                                            fontSize={'md'}
                                            fontWeight={600}
                                            color={'white'}
                                            bg={'teal.400'}
                                            onClick={onOpen}
                                            _hover={{
                                                bg: 'teal.300'
                                            }}>
                                            Add Withdrawal Request
                                        </Button>
                                    </Box>
                                </Flex>{' '}
                                <Box overflowX="auto">
                                    <Table>
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th w="30%">Description</Th>
                                                <Th isNumeric>Amount</Th>
                                                <Th maxW="12%" isTruncated>
                                                    Recipient Wallet Address
                                                </Th>
                                                <Th>Approval Count </Th>
                                                <Th>Approve </Th>
                                                <Th>Finalize </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {requestsList.map((request, index) => {
                                                return (
                                                    <RequestRow
                                                        key={index}
                                                        id={index}
                                                        request={request}
                                                        approversCount={approversCount}
                                                        campaignId={campaignId}
                                                        disabled={FundNotAvailable}
                                                        ETHPrice={ETHPrice}
                                                    />
                                                );
                                            })}
                                        </Tbody>
                                        <TableCaption textAlign="left" ml="-2">
                                            Found {requestCount} Requests
                                        </TableCaption>
                                    </Table>
                                </Box>
                            </Container>
                        ) : (
                            <div>
                                <Container
                                    px={{ base: '4', md: '12' }}
                                    maxW={'7xl'}
                                    align={'left'}
                                    display={isLoading ? 'block' : 'none'}>
                                    <SimpleGrid rows={{ base: 3 }} spacing={2}>
                                        <Skeleton height="2rem" />
                                        <Skeleton height="5rem" />
                                        <Skeleton height="5rem" />
                                        <Skeleton height="5rem" />
                                    </SimpleGrid>
                                </Container>
                                <Container
                                    maxW={'lg'}
                                    align={'center'}
                                    display={requestsList.length === 0 && !isLoading ? 'block' : 'none'}>
                                    <SimpleGrid row spacing={2} align="center">
                                        <Stack align="center">
                                            <NextImage
                                                src="/static/no-requests.webp"
                                                alt="no-request"
                                                width="150"
                                                height="150"
                                            />
                                        </Stack>
                                        <Heading
                                            textAlign={'center'}
                                            color={useColorModeValue('gray.800', 'white')}
                                            as="h4"
                                            size="md">
                                            No Requests yet for {name} Campaign
                                        </Heading>
                                        <Text
                                            textAlign={useBreakpointValue({ base: 'center' })}
                                            color={useColorModeValue('gray.600', 'gray.300')}
                                            fontSize="sm">
                                            Create a Withdrawal Request to Withdraw funds from the Campaign😄
                                        </Text>

                                        <Button
                                            onClick={onOpen}
                                            fontSize={'md'}
                                            fontWeight={600}
                                            color={'white'}
                                            bg={'teal.400'}
                                            _hover={{
                                                bg: 'teal.300'
                                            }}>
                                            Create Withdrawal Request
                                        </Button>
                                    </SimpleGrid>
                                </Container>
                            </div>
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a Withdrawal Request 💸</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={4}>
                                    <FormControl id="description">
                                        <FormLabel>Request Description</FormLabel>
                                        <Textarea
                                            {...register('description', { required: true })}
                                            isDisabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormControl id="value">
                                        <FormLabel>Amount in Ether</FormLabel>
                                        <InputGroup>
                                            {' '}
                                            <Input
                                                type="number"
                                                {...register('value', { required: true })}
                                                isDisabled={isSubmitting}
                                                onChange={(e) => {
                                                    setInUSD(Math.abs(e.target.value));
                                                }}
                                                step="any"
                                            />{' '}
                                            <InputRightAddon children="ETH" />
                                        </InputGroup>
                                        {inUSD ? (
                                            <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, inUSD)}</FormHelperText>
                                        ) : null}
                                    </FormControl>

                                    <FormControl id="recipient">
                                        <FormLabel htmlFor="recipient">Recipient Ethereum Wallet Address</FormLabel>
                                        <Input
                                            name="recipient"
                                            {...register('recipient', {
                                                required: true
                                            })}
                                            isDisabled={isSubmitting}
                                        />
                                    </FormControl>
                                    {errors.description || errors.value || errors.recipient ? (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription mr={2}> All Fields are Required</AlertDescription>
                                        </Alert>
                                    ) : null}
                                    {error ? (
                                        <Alert status="error">
                                            <AlertIcon />
                                            <AlertDescription mr={2}> {error}</AlertDescription>
                                        </Alert>
                                    ) : null}
                                    <Stack spacing={10}>
                                        {wallet.status === 'connected' ? (
                                            <Button
                                                bg={'teal.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'teal.500'
                                                }}
                                                isLoading={isSubmitting}
                                                type="submit">
                                                Create Withdrawal Request
                                            </Button>
                                        ) : (
                                            <Stack spacing={3}>
                                                <Button
                                                    color={'white'}
                                                    bg={'teal.400'}
                                                    _hover={{
                                                        bg: 'teal.300'
                                                    }}
                                                    onClick={() => wallet.connect()}>
                                                    Connect Wallet{' '}
                                                </Button>
                                                <Alert status="warning">
                                                    <AlertIcon />
                                                    <AlertDescription mr={2}>
                                                        Please Connect Your Wallet First to Create a Campaign
                                                    </AlertDescription>
                                                </Alert>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
