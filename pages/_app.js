import { ChakraProvider } from '@chakra-ui/react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UseWalletProvider } from 'use-wallet';

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <UseWalletProvider
                chainId={4}
                connectors={{
                    walletconnect: {
                        rpcUrl: 'https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7'
                    }
                }}>
                <Component {...pageProps} />
            </UseWalletProvider>
        </ChakraProvider>
    );
}

export default MyApp;
