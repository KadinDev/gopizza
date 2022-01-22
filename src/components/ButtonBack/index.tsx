import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// para acessar meu tema de cores do projeto
import { useTheme } from 'styled-components/native';

// as propriedades do TouchableOpacity
import { TouchableOpacityProps } from 'react-native';

import {
    Container
} from './styles';

// agora pego todo o restante das propriedades desse botão e passo aqui, 
// todo o resto de TouchableOpacityProps
export function ButtonBack( {...rest} : TouchableOpacityProps ){

    // pegando as cores do meu theme
    const { COLORS } = useTheme();

    return (
        // agora passo aqui pra esse container, pra quando eu chamar ele em alguma tela,
        // eu conseguir acessar as propriedades dele
        <Container 
            {...rest} 
            activeOpacity={0.8}    
        >
            <MaterialIcons name='chevron-left' size={18} color={COLORS.TITLE} />

        </Container>
    );
}