import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { SimpleGrid } from '@chakra-ui/layout';
import Link from 'next/link';
import { AiFillInfoCircle, AiOutlineLike } from 'react-icons/ai';
import { RiTableFill } from 'react-icons/ri';
import web3 from '../smart-contract/web3';
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from '../lib/getETHPrice';
import { Stat, StatLabel, StatNumber, Tooltip, useColorModeValue } from '@chakra-ui/react';

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
    description,
    minimumContribution,
    ETHPrice,
    requestsCount,
    approversCount,
    manager
}) {
    return (
        <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
                <Tab>
                    <AiFillInfoCircle /> <Text ml={2}>About</Text>
                </Tab>
                <Tab>
                    {' '}
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
                    <Table variant="striped" colorScheme="teal" size="sm">
                        <TableCaption>Found 3 requests</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Description</Th>
                                <Th>Amount</Th>
                                <Th>Recipient</Th>
                                <Th>Count</Th>
                                <Th>Approve</Th>
                                {/* <Th>Finalize</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>0</Td>
                                <Td>
                                    <div
                                        style={{
                                            width: '9rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                        Buy battery casings
                                    </div>
                                </Td>
                                <Td>2</Td>
                                <Td>
                                    <div
                                        style={{
                                            width: '16rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                        0x52Fbce6446D066c1324fD3cdC36BC8EA22CD8883
                                    </div>
                                </Td>
                                <Td>3/6</Td>
                                <Td>
                                    <Button size="sm" colorScheme="teal">
                                        <AiOutlineLike />
                                    </Button>
                                </Td>
                                {/* <Td>
                                    <Button size="sm" colorScheme="teal">
                                        <HiOutlinePencilAlt />
                                    </Button>
                                </Td> */}
                            </Tr>
                        </Tbody>
                    </Table>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}
