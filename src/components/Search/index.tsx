import React from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import {
    Container,
    Input,
    Button,
    InputArea,
    ButtonClear,
} from './styles';

type Props = TextInputProps & {
    // dois botões que estou tipando, como função.
    onSearch: () => void; // passo tipando função aqui tbm. essa para buscar
    onClear: () => void; // essa para limpeza
    /* passo essa tipando para os botões abaixo, e na tela de home onde pego
    esses botões, pego essas funções lá tbm */
};

export function Search( { onSearch, onClear, ...rest } : Props ){
    
    const { COLORS } = useTheme();

    return (
        <Container>
            <InputArea>
                <Input placeholder="Pesquisasr" {...rest} />

                <ButtonClear onPress={onClear}>
                    <Feather name='x' size={16} />
                </ButtonClear>
            </InputArea>

            <Button onPress={onSearch}>
                <Feather name='search' size={16} color={COLORS.TITLE} />
            </Button>

        </Container>
    );
}