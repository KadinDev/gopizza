import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

import {
    Container,
    Content,
    Image,
    Details,
    Name,
    Identification,
    Description,
    Line
} from './styles';

// Quando eu clicar em alguma pizza e for para a tela dela,
// estou exportando esse type, para acessar lá, nele será os
// detalhes da pizza que cliquei
export type ProductProps = {
    id: string;
    photo_url: string;
    name: string;
    description: string;
}

type Props = RectButtonProps & {
    data: ProductProps; // ProductProps - os detalhes do produto
    // tipagem acima. lembra que mando como data. para pegar digita data.
}

// pego o data de Props e todo o restante - ...rest
export function ProductCard( { data, ...rest } : Props ){

    const { COLORS } = useTheme();

    return (
        <Container>

            <Content {...rest} >
                <Image source={{ uri: data.photo_url }} />

                <Details>
                    <Identification>
                        <Name> {data.name} </Name>
                        <Feather name='chevron-right' size={18} color={COLORS.SHAPE} />
                    </Identification>

                    <Description> { data.description } </Description>
                </Details>

            </Content>

            <Line/>

        </Container>
    );
}