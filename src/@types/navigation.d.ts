/*
criei esse separado pq quando eu quiser buscar e tipar tbm o meu parametro
de rotas eu uso a mesma tipagem 
*/
export type ProductNavigationProps = {
    id?: string; // ? opcional
};

export type OrderNavigationProps = {
    id: string;
}

// estou fazendo a tipagem das rotas aqui

export declare global {
    namespace ReactNavigation {
        // tipando
        // depois dos (:) é chamado de parametro
        interface RootParamList {
            home: undefined;
            product: ProductNavigationProps;
            order: OrderNavigationProps; // essa é a de fazer pedido
            orders: undefined; // para listas os pedidos
        }
    }
}