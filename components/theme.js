import { extendTheme } from '@chakra-ui/react';
// 2. Add your color mode config
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false
};
const theme = extendTheme({ config });
export default theme;