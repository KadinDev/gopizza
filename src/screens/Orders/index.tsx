import React, { useEffect, useState } from 'react';
import { FlatList, Alert } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {useAuth} from '@hooks/auth';

import {
    Container,
    Header,
    Title
} from './styles';

import { OrderCard, OrderProps } from '@components/OrderCard';
import { ItemSeparator } from '@components/ItemSeparator';

export function Orders(){
    const {user} = useAuth();
    const [orders, setOrders] = useState<OrderProps[]>([]);

    function handlePizzaDelivered(id: string){
        Alert.alert('Pedido', 'Confirmar que a pizza foi entregue?',[
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: () => {
                    firestore().collection('orders').doc(id).update({
                        status: 'Entregue'
                    })
                }
            }
        ])
    };

    useEffect( () => {
        const subscribe = firestore()
        .collection('orders')
        .where('waiter_id', '==', user?.id )
        .onSnapshot(querySnapshot => { //verificar sempre em tempo real
            const data = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                } 
            }) as OrderProps[];

            setOrders(data)
        });

        return () => subscribe(); //para limpar o subscribe
    },[])

    return (
        <Container>
            <Header>
                <Title>Pedidos feitos</Title>
            </Header>

            <FlatList
                data={ orders }
                keyExtractor={item => item.id}
                renderItem={ ({ item, index }) => (
                    
                    <OrderCard 
                        index={index} 
                        data={item} 
                        disabled={item.status === 'Entregue'}
                        
                        onPress={() => handlePizzaDelivered(item.id)}
                    />

                ) }

                numColumns={2} // fica um ao lado do outro
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 50}}
                
                // ele cria um item de separação
                ItemSeparatorComponent={ () => <ItemSeparator/> }
            />
        </Container>
    );
}