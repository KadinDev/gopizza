import React from 'react';

import { TextInputProps } from 'react-native';

import {
    Container,
    TypeProps
} from './styles';

type Props = TextInputProps & {
    // ? = opcional, ou seja vai começar como primary
    type?: TypeProps // TypeProps do ./styles
}

// pra esse Input defini no styles que ele terá dois tipos, primary e secondary
// quando passo conforme aqui em baixo: { ...rest } : Props, estou passando todas as props (...rest)
// de um TextInput para ele, estou tipando ele com as Props que criei acima
// para quando eu chamar esse Input em outro componentes além de ter acesso aos dois tipos dele
// eu posso acrescentar para esse input em outro componente qualquer outra props do TextInput
export function Input( {type = 'primary', ...rest} : Props ){
    return (
        <Container
        // e passo para cá o tipo e todo o ...rest(restante)
            type={type}
            {...rest}
        >

        </Container>
    );
}