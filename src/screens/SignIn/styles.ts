import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

//para lidar caso seja no iphone, para nada ficar atrás das barrinhas
//de cima e de baixo caso tenha no iphone
// getBottomSpace, ele vai fazer isso
import { getBottomSpace } from 'react-native-iphone-x-helper';

// .attrs para acessar as props do LinearGradient
// desestruturar meu ({ theme }) para acessar as cores
export const Container = styled(LinearGradient).attrs(({ theme }) => ({
    colors: theme.COLORS.GRADIENT,
    start: { x: 0, y: 1 }, //manipulando direção do gradiente
    end: { x: 0.5, y: 0.5 },
}) )`
    flex: 1;
    justify-content: center;
`;

export const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: getBottomSpace() + 48
    }
})`
    width: 100%;
    padding: 0 32px;
`

export const Title = styled.Text`
    font-size: 32px;
    margin-bottom: 24px;
    align-self: flex-start;

    ${({ theme}) => css`
        font-family: ${theme.FONTS.TITLE};
        color: ${theme.COLORS.TITLE};
    `}
`;

export const Brand = styled.Image.attrs({
    resizeMode: 'contain',
})`
    height: 340px;
    margin-top: 64px;
    margin-bottom: 32px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity.attrs({
    activeOpacity: 0.8,
})`
    align-self: flex-end;
    margin-bottom: 20px;
`;

export const ForgotPasswordLabel = styled.Text`
    font-size: 16px;
    line-height: 18px;

    ${({ theme}) => css`
        font-family: ${theme.FONTS.TEXT};
        color: ${theme.COLORS.TITLE};
    `}
`;