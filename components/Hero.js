import { Button, Center, Container, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

export default function CallToActionWithIllustration() {
    return (
        <Container maxW={'5xl'}>
            <Stack spacing={6} direction={'row'} mt={20}>
                <Center>
                    <img src="/img_1.png" alt="Picture of the author" width={700}/>
                </Center>
                <Stack textAlign={'center'} align={'center'} spacing={{ base: 8, md: 8 }} py={{ base: 5, md: 8 }}>
                    <Heading fontWeight={600} fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
                    Crowdfunding using the powers of{' '}
                        <Text as={'span'} color={'orange.400'}>
                            Crypto & Blockchain 😄
                        </Text>
                    </Heading>
                    <Text color={'gray.500'} maxW={'3xl'}>
                    
                    </Text>
                    <Stack spacing={6} direction={'row'}>
                        <Button
                            rounded={'full'}
                            px={6}
                            colorScheme={'orange'}
                            bg={'orange.400'}
                            _hover={{ bg: 'orange.500' }}>
                            Get started
                        </Button>
                        <Button rounded={'full'} px={6}>
                            Learn more
                        </Button>
                    </Stack>
                </Stack>
             </Stack>
        </Container>
    );
}