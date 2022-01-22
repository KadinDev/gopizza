import styled, { css } from 'styled-components/native';

//ele já vem instalado por padrão no expo
// esse botão preserva a experiência do usuário na plataforma
// no android ele faz o efeito de ondinha quando clica no botão
// no ios ela faz a opacidade
import { RectButton } from 'react-native-gesture-handler';

// digo que o botão vai ter duas opções
export type TypeProps = 'primary' | 'secondary';
// o type
type ContainerProps = {
    type: TypeProps;
}

export const Container = styled(RectButton)<ContainerProps>`
    flex: 1;
    max-height: 56px;
    min-height: 56px;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, type }) => type === 'primary' ? theme.COLORS.SUCCESS_900 : theme.COLORS.PRIMARY_800 };
`;

export const Title = styled.Text`
    font-size: 18px;

    ${({theme}) => css`
        color: ${theme.COLORS.TITLE};
        font-family: ${theme.FONTS.TEXT};
    `};

`;

// loading no botão
export const Load = styled.ActivityIndicator.attrs( ({ theme }) => ({
    color: theme.COLORS.TITLE
}))``;