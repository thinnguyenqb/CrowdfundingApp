import { useState, useEffect, useRef } from 'react';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { Progress } from '@chakra-ui/progress';
import { BiDonateHeart } from 'react-icons/bi';
import web3 from '../smart-contract/web3';
import { useDisclosure } from '@chakra-ui/hooks';
import Campaign from '../smart-contract/campaign';
import { useForm } from 'react-hook-form';
import { useWallet } from 'use-wallet';
import { useRouter } from "next/router";
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from '../lib/getETHPrice';
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
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  Input,
  InputRightAddon,
  FormHelperText,
  Image
} from '@chakra-ui/react';

export default function CampaignInfo({ balance, ETHPrice, target, campaignId, id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
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
    async function onSubmit(data) {
        try {
          const campaign = Campaign(campaignId);
          const accounts = await web3.eth.getAccounts();
          await campaign.methods.contibute().send({
            from: accounts[0],
            value: web3.utils.toWei(data.value, "ether"),
          });
          router.push(`/campaign/${campaignId}`);
          reset("", {
            keepValues: false,
          });
          onClose();
          setError(false);
        } catch (err) {
          setError(err.message);
          console.log(err);
        }
    }
    return (
        <div>
            <Stack>
                <Button
                    h={16}
                    leftIcon={<BiDonateHeart fontSize="30px" />}
                    colorScheme="teal"
                    variant="solid"
                    fontWeight="bold"
                    fontSize="lg"
                    background="#0fffc8"
                    onClick={onOpen}
                    color="#1a202c">
                    CONTRIBUTE NOW
                </Button>
                <Box>
                    <Box fontSize={'2xl'} isTruncated maxW={{ base: '15rem', sm: 'sm' }} pt="2">
                        <Text as="span" fontWeight={'bold'}>
                            {balance > 0 ? web3.utils.fromWei(balance, 'ether') : '0, Become a Donor 😄'}
                        </Text>
                        <Text as="span" display={balance > 0 ? 'inline' : 'none'} pr={2} fontWeight={'bold'}>
                        {' '} ETH
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

                    
                        <Flex>
                            <Text as="span" fontSize="1rem" mr="10px">
                            target of{' '}
                            </Text>
                    
                            <Image width={"20px"} src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png' alt='Dan Abramov' />
                            <Text as="span" color="#ffffffeb" fontSize="1rem" mx="3px">
                                {web3.utils.fromWei(target, 'ether')} ETH ($
                                {getWEIPriceInUSD(ETHPrice, target)})
                            </Text>
                        </Flex>
                </Box>
                <Progress
                    hasStripe
                    value={web3.utils.fromWei(balance, 'ether')}
                    max={web3.utils.fromWei(target, 'ether')}
                />
                <Flex>
                    <Text fontSize="md">
                        <Text as="span" fontSize="1.3rem" fontWeight="bold">
                            78
                        </Text>{' '}
                        days left
                    </Text>
                </Flex>
            </Stack>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contribute now</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={4}>
                                    <FormControl id="value">
                                        <FormLabel>Amount in Ether you want to contribute</FormLabel>
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
                                                Contribute
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
        </div>
    );
}
