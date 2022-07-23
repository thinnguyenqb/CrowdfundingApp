import NextLink from 'next/link';
import { AiFillInfoCircle, AiOutlineLike } from 'react-icons/ai';
import { RiTableFill } from 'react-icons/ri';
import web3 from '../smart-contract/web3';
import { useRouter } from "next/router";
import { useDisclosure } from '@chakra-ui/hooks';
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from '../lib/getETHPrice';
import {
    Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tooltip,
  Tr,
  Th,
  Td,
  TableCaption,
  Skeleton,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  Link,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  Input,
  InputRightAddon,
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
import {
    InfoIcon,
    CheckCircleIcon,
    WarningIcon,
  } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from 'react';
import Campaign from '../smart-contract/campaign';
import NextImage from 'next/image';
import { useForm } from 'react-hook-form';
import { useWallet } from 'use-wallet';
import { useAsync } from 'react-use';

function StatsCard(props) {
    const { title, stat, info } = props;
    return (
        <div>
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
        </div>
    );
}

const RequestRow = ({
    id,
    request,
    approversCount,
    campaignId,
    disabled,
    ETHPrice,
  }) => {
    const router = useRouter();
    const readyToFinalize = request.approvalCount > approversCount / 2;
    const [errorMessageApprove, setErrorMessageApprove] = useState();
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [errorMessageFinalize, setErrorMessageFinalize] = useState();
    const [loadingFinalize, setLoadingFinalize] = useState(false);
    const onApprove = async () => {
      setLoadingApprove(true);
      try {
        const campaign = Campaign(campaignId);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send({
          from: accounts[0],
        });
        router.reload();
      } catch (err) {
        setErrorMessageApprove(err.message);
      } finally {
        setLoadingApprove(false);
      }
    };
  
    const onFinalize = async () => {
      setLoadingFinalize(true);
      try {
        const campaign = Campaign(campaignId);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send({
          from: accounts[0],
        });
        router.reload();
      } catch (err) {
        setErrorMessageFinalize(err.message);
      } finally {
        setLoadingFinalize(false);
      }
    };
  
    return (
        <Tr
            bg={
            readyToFinalize && !request.complete
                ? useColorModeValue("teal.100", "teal.700")
                : useColorModeValue("gray.100", "gray.700")
            }
            opacity={request.complete ? "0.4" : "1"}
        >
            <Td>{id} </Td>
            <Td>{request.description}</Td>
            <Td isNumeric>
            {web3.utils.fromWei(request.value, "ether")}ETH ($
            {getWEIPriceInUSD(ETHPrice, request.value)})
            </Td>
            <Td>
            <Link
                color="teal.500"
                href={`https://rinkeby.etherscan.io/address/${request.recipient}`}
                isExternal
            >
                {" "}
                {request.recipient.substr(0, 10) + "..."}
            </Link>
            </Td>
            <Td>
            {request.approvalCount}/{approversCount}
            </Td>
            <Td>
            <HStack spacing={2}>
                <Tooltip
                label={errorMessageApprove}
                bg={useColorModeValue("white", "gray.700")}
                placement={"top"}
                color={useColorModeValue("gray.800", "white")}
                fontSize={"1em"}
                >
                <WarningIcon
                    color={useColorModeValue("red.600", "red.300")}
                    display={errorMessageApprove ? "inline-block" : "none"}
                />
                </Tooltip>
                {request.complete ? (
                <Tooltip
                    label="This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers"
                    bg={useColorModeValue("white", "gray.700")}
                    placement={"top"}
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={"1em"}
                >
                    <CheckCircleIcon
                    color={useColorModeValue("green.600", "green.300")}
                    />
                </Tooltip>
                ) : (
                    <div>
                        <Button
                            colorScheme="yellow"
                            variant="outline"
                            _hover={{
                            bg: "yellow.600",
                            color: "white",
                            }}
                            onClick={onApprove}
                            isDisabled={disabled || request.approvalCount == approversCount}
                            isLoading={loadingApprove}
                        >
                            Approve
                        </Button>
                    </div>
                )}
            </HStack>
            </Td>
            <Td>
                <Tooltip
                    label={errorMessageFinalize}
                    bg={useColorModeValue("white", "gray.700")}
                    placement={"top"}
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={"1em"}
                >
                    <WarningIcon
                    color={useColorModeValue("red.600", "red.300")}
                    display={errorMessageFinalize ? "inline-block" : "none"}
                    mr="2"
                    />
                </Tooltip>
                {request.complete ? (
                    <Tooltip
                        label="This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers"
                    bg={useColorModeValue("white", "gray.700")}
                    placement={"top"}
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={"1em"}
                    >
                    <CheckCircleIcon
                        color={useColorModeValue("green.600", "green.300")}
                    />
                    </Tooltip>
                ) : (
                    <HStack spacing={2}>
                    <Button
                        colorScheme="green"
                        variant="outline"
                        _hover={{
                        bg: "green.600",
                        color: "white",
                        }}
                        isDisabled={disabled || (!request.complete && !readyToFinalize)}
                        onClick={onFinalize}
                        isLoading={loadingFinalize}
                    >
                        Finalize
                    </Button>
        
                    <Tooltip
                        label="This Request is ready to be Finalized because it has been approved by 50% Approvers"
                        bg={useColorModeValue("white", "gray.700")}
                        placement={"top"}
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"1.2em"}
                    >
                        <InfoIcon
                        as="span"
                        color={useColorModeValue("teal.800", "white")}
                        display={
                            readyToFinalize && !request.complete ? "inline-block" : "none"
                        }
                        />
                    </Tooltip>
                    </HStack>
                )}
            </Td>
        </Tr>
    );
  };

export default function CampaignTab({
    id,
    campaignId,
    description,
    minimumContribution,
    ETHPrice,
    requestsCount,
    approversCount,
    manager,
    name,
    balance
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
        if (balance == 0) {
           setFundNotAvailable(true);
        }
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
        const campaign = Campaign(id);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(data.description, web3.utils.toWei(data.value, 'ether'), data.recipient)
                .send({ from: accounts[0] });

            reset();
            onClose();
            router.reload();
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
                        <Link color="teal.500" href={`https://rinkeby.etherscan.io/address/${id}`} target="_blank">
                            View on Rinkeby Etherscan
                        </Link>
                        <SimpleGrid py={5} columns={{ base: 1  }} spacing={{ base: 3 }}>
                            <Box w='full'>
                                <StatsCard
                                    w={'200px'}
                                    title={'Wallet Address of Campaign Creator'}
                                    stat={manager}
                                    info={
                                        'The Campaign Creator created the campaign and can create requests to withdraw money.'
                                    }
                                />
                            </Box>
                             <Flex spacing={{ base: 3 }}>
                                <Box w={'full'} mr={"10px"}>
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
                                </Box>
                                <Box w={'full'} mr={"10px"}>
                                    <StatsCard
                                        title={'Number of Requests'}
                                        stat={requestsCount}
                                        info={
                                            'A request tries to withdraw money from the contract. Requests must be approved by approvers'
                                        }
                                    />
                                </Box>
                                
                                <Box w={'full'}>
                                    <StatsCard
                                        title={'Number of Approvers'}
                                        stat={approversCount}
                                        info={'Number of people who have already donated to this campaign'}
                                    />
                                </Box>
                            </Flex>
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        {requestsList.length > 0 ? (
                            <Container px={{ base: '4', md: '0' }} maxW={'7xl'} align={'left'}>
                                <Flex flexDirection={{ base: 'column', lg: 'row' }} py={4}>
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
                                                <Th maxW="12%">
                                                    Recipient Wallet Address
                                                </Th>
                                                <Th>Approval Count </Th>
                                                <Th>Approve </Th>
                                                <Th>Finalize </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {requestsList?.map((request, index) => {
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
                                            Found {requestsList.length} Requests
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
                                    maxW={'lg'}d
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
