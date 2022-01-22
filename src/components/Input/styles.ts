import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';

// fazendo as variações do Input, como vou usar o mesmo input em outra tela e
// vai mudar alguns detalhes, aqui faço a configuração para os dois inputs
export type TypeProps = 'primary' | 'secondary'

type Props = {
    type: TypeProps;
}

// aí através do attrs, coloco o <Props> lá, e pego o meu theme, e o type criado acima
//passo em baixo antes do width tbm, para as de baixo tbm definir o de cada 
export const Container = styled(TextInput).attrs<Props>(({ theme, type  }) => ({
    placeholderTextColor: type === 'primary' ? theme.COLORS.SECONDARY_900 : theme.COLORS.PRIMARY_50
})) <Props>` 
    width: 100%;
    height: 56px;
    background-color: transparent;
    border-radius: 12px;
    font-size: 14px;
    padding: 7px 0;
    padding-left: 20px;
    margin-bottom: 16px;


    ${({ theme, type }) => css`
        font-family: ${theme.FONTS.TEXT};
        border: 1px solid ${theme.COLORS.SHAPE};
        color: ${ type === 'primary' ? theme.COLORS.SECONDARY_900 : theme.COLORS.TITLE };
    `}
`;