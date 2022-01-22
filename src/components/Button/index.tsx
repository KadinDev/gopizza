import React from 'react';

// para funcionar o ReactButton do styles.ts
import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container,
    Title,
    Load,
    TypeProps
} from './styles';

// ? = é opcional
type Props = RectButtonProps & {
    title: string;
    type?: TypeProps; // do ./styles
    isLoading?: boolean;
}

// como é opcional acima aqui defino que o type será por padrão primary, e isLoadng false
export function Button( {
    title, 
    type = 'primary', 
    isLoading = false, 
    ...rest
} : Props ){
    

    // aí o title dentro do botão eu coloco no componente importado
    // como está no SignIn, title é string, como foi definido no type Props
    return (
        <Container
            type={type}

            // enabled é o botão habilitado ou não,
            // vai ficar habilitado somente quando o isLoading estiver false
            enabled={!isLoading}
            {...rest}
        >

            { isLoading ? <Load/> : <Title> {title} </Title> }

        </Container>
    );
}