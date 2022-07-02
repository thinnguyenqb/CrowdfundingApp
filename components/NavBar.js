import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    InputRightAddon,
    InputGroup,
    useDisclosure,
    useColorModeValue,
    Stack,
    Input,
    Textarea,
    FormControl,
    FormLabel,
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
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from '@chakra-ui/number-input';
import React, { useState, useRef } from "react";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import NextLink from 'next/link';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getETHPrice, getETHPriceInUSD } from "../lib/getETHPrice";

import factory from "../smart-contract/factory";
import web3 from "../smart-contract/web3";

const Links = ['Home'];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700')
        }}
        href={'/'}>
        {children}
    </Link>
);

export default function Navbar() {
    const wallet = useWallet();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const router = useRouter();
    const [error, setError] = useState('');
    const [minContriInUSD, setMinContriInUSD] = useState();
    const [targetInUSD, setTargetInUSD] = useState();
    const [ETHPrice, setETHPrice] = useState(0);

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
        console.log(data.minimumContribution, data.campaignName, data.description, data.imageUrl, data.target);
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(
                    web3.utils.toWei(data.minimumContribution, 'ether'),
                    data.campaignName,
                    data.description,
                    data.imageUrl,
                    web3.utils.toWei(data.target, 'ether')
                )
                .send({
                    from: accounts[0]
                });
            
                reset();
                onClose();
            router.push('/');
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}  pos="fixed" zIndex="999" w={"full"} top="0">
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                            style={{ fontWeight: '600', fontSize: '22px', color: '#81e6d9' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>TST Team</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Button
                            variant={'solid'}
                            colorScheme={'teal'}
                            size={'sm'}
                            mr={4}
                            leftIcon={<AddIcon />}
                            onClick={onOpen}>
                            Create Campaign
                        </Button>
                        {wallet.status === 'connected' ? (
                            <Menu>
                                <MenuButton size={'sm'} as={Button} rightIcon={<ChevronDownIcon />}>
                                    {wallet.account.substr(0, 10) + '...'}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => wallet.reset()}> Disconnect Wallet </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <div>
                                <Button
                                    variant={'solid'}
                                    colorScheme={'teal'}
                                    size={'sm'}
                                    onClick={() => wallet.connect()}>
                                    Connect Wallet{' '}
                                </Button>
                            </div>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a New Campaign 📢</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={4}>
                                <FormControl id="minimumContribution">
                                    <FormLabel>Minimum Contribution Amount</FormLabel>
                                    <InputGroup>
                                        {' '}
                                        <Input
                                            type="number"
                                            step="any"
                                            {...register('minimumContribution', { required: true })}
                                            isDisabled={isSubmitting}
                                            onChange={(e) => {
                                                setMinContriInUSD(Math.abs(e.target.value));
                                            }}
                                        />{' '}
                                        <InputRightAddon children="ETH" />
                                    </InputGroup>
                                    {minContriInUSD ? (
                                        <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, minContriInUSD)}</FormHelperText>
                                    ) : null}
                                </FormControl>
                                <FormControl id="campaignName">
                                    <FormLabel>Campaign Name</FormLabel>
                                    <Input
                                        {...register('campaignName', { required: true })}
                                        isDisabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormControl id="description">
                                    <FormLabel>Campaign Description</FormLabel>
                                    <Textarea
                                        {...register('description', { required: true })}
                                        isDisabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormControl id="imageUrl">
                                    <FormLabel>Image URL</FormLabel>
                                    <Input
                                        {...register('imageUrl', { required: true })}
                                        isDisabled={isSubmitting}
                                        type="url"
                                    />
                                </FormControl>
                                <FormControl id="target">
                                    <FormLabel>Target Amount</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type="number"
                                            step="any"
                                            {...register('target', { required: true })}
                                            isDisabled={isSubmitting}
                                            onChange={(e) => {
                                                setTargetInUSD(Math.abs(e.target.value));
                                            }}
                                        />
                                        <InputRightAddon children="ETH" />
                                    </InputGroup>
                                    {targetInUSD ? (
                                        <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, targetInUSD)}</FormHelperText>
                                    ) : null}
                                </FormControl>

                                {error ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription mr={2}> {error}</AlertDescription>
                                    </Alert>
                                ) : null}
                                {errors.minimumContribution ||
                                errors.name ||
                                errors.description ||
                                errors.imageUrl ||
                                errors.target ? (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription mr={2}> All Fields are Required</AlertDescription>
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
                                            Create
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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
