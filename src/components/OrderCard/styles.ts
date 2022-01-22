import styled, {css} from 'styled-components/native';

type ContainerProps = {
    // esse index para fazer a sacadinhas das bordas na tela, como não terá
    //borda dos lados, somente por dentro dos cards, eu vou usar assim para resolver isso
    index: number,
};

// mudar o visual dos cards de acordo com o status de cada.
// criei esse type separado para eu exportar e usar somente isso no componente
export type StatusTypesProps = 'Preparando' | 'Pronto' | 'Entregue';

type StatusProps = {
    status: StatusTypesProps;
}

export const Container = styled.TouchableOpacity.attrs<ContainerProps>(() => ({
    activeOpacity: 0.8,
}))<ContainerProps>`
    width: 50%;
    align-items: center;
    padding: 24px;

    ${({ theme, index }) => css`
        border-right-width: ${ index % 2 > 0 ? 0 : 1 };
        border-right-color: ${ theme.COLORS.SHAPE};
    ` };
`;

export const Image = styled.Image`
    width: 104px;
    height: 104px;
    border-radius: 52px;
`;

export const Name = styled.Text`
    font-size: 20px;
    margin-top: 21px;

    ${({theme}) => css`
        font-family: ${theme.FONTS.TITLE};
        color: ${theme.COLORS.SECONDARY_900};
    `}
`;

export const Description = styled.Text`
    font-size: 14px;
    margin-top: 11px;

    ${({theme}) => css`
        font-family: ${theme.FONTS.TEXT};
        color: ${theme.COLORS.SECONDARY_400};
    `}
`;

export const StatusContainer = styled.View<StatusProps>`
    padding: 4px 16px;
    border-radius: 12px;
    margin-top: 16px;
    align-items: center;
    justify-content: center;


    ${({ status, theme }) => status === 'Preparando' && css`
        background-color: ${theme.COLORS.ALERT_50};
        border: 1px solid ${theme.COLORS.ALERT_900};
    `};

    ${({ status, theme }) => status === 'Pronto' && css`
        background-color: ${theme.COLORS.SUCCESS_900};
    `};

    ${({ status, theme }) => status === 'Entregue' && css`
        background-color: ${theme.COLORS.SECONDARY_900};
    `};

`;

export const StatusLabel = styled.Text<StatusProps>`
    font-size: 12px;
    line-height: 15px;

    ${({ status, theme }) => css`
        font-family: ${theme.FONTS.TEXT};
        color: ${ status === 'Preparando' ? theme.COLORS.ALERT_900 : theme.COLORS.TITLE }
    `};
`;