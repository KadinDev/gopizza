import React, { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

import { PIZZA_TYPES } from '@utils/pizzaTypes';

import {
    Container,
    ContentScroll,
    Header,
    Photo,
    Sizes,
    Form,
    Title,
    Label,
    InputGroup,
    FormRow,
    Price
} from './styles';

import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@hooks/auth';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';

import { OrderNavigationProps } from '@src/@types/navigation';
import { ProductProps } from '@src/components/ProductCard';

type PizzaResponse = ProductProps & {
    // pegando como uma chave dinamica, pq tenho 3 preços
    /* pegando assim pq no firebase tenho como letras( P, M, G), 
    e o valor numerico de cada na frente*/
    prices_sizes: {
        [key: string]: number;
    }
}

export function Order(){
    const [size, setSize] = useState('');
    //começa sendo um objeto vazaio desse tipo (PizzaResponse)
    const [pizza, setPizza] = useState<PizzaResponse>( {} as PizzaResponse );
    const [quantity, setQuantity] = useState(0);
    const [tableNumber, setTableNumber] = useState('');
    const [sendingOrder, setSendingOrder] = useState(false);//pedido

    const {user} = useAuth(); //para pegar user logado
    const navigation = useNavigation();
    const route = useRoute();
    const {id} = route.params as OrderNavigationProps;

    //pega o valor da pizza escolhida e multiplica pela quantidade
    const amount = size ? pizza.prices_sizes[size] * quantity : '0,00'

    function handleGoBack(){
        navigation.goBack();
    };

    // pedido da pizza
    async function handleOrder(){
        if(!size){
            return Alert.alert('Pedido', 'Selecione o tamanho da pizza.');
        }

        if(!tableNumber){
            return Alert.alert('Pedido', 'Informe o numero da mesa.');
        }

        if(!quantity){
            return Alert.alert('Pedido', 'Informe a quantidade.');
        }

        setSendingOrder(true);

        await firestore()
        .collection('orders')
        .add({
            quantity,
            amount,
            pizza: pizza.name,
            size,
            table_number: tableNumber,
            status: 'Preparando',
            waiter_id: user?.id,
            image: pizza.photo_url
        })
        .then(() => navigation.navigate('home') )
        .catch(() => {
            Alert.alert('Pedido', 'Não foi possível realizar o pedido.');
            setSendingOrder(false);
        })
    }

    useEffect( () => {
        if(id){
            firestore()
            .collection('pizzas')
            .doc(id) //acessando o documento desse id
            .get()
            .then(response => setPizza(response.data() as PizzaResponse ))
            .catch( () => Alert.alert('Pedido', 'Não foi possível carregar o produto.') );
        }
    
    },[id]);

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

            <ContentScroll>

                <Header>
                    <ButtonBack
                        onPress={ handleGoBack }
                        style={{ marginBottom: 108 }}
                    />
                </Header>

                <Photo source={{ uri: pizza.photo_url }} />

                <Form>
                    <Title> {pizza.name} </Title>
                    <Label> Selecione um tamanho </Label>

                    <Sizes>
                        {
                            // criei o PIZZA_TYPES em utils passando as imformações lá,
                            // e faço o array assim
                            PIZZA_TYPES.map(item => (
                                <RadioButton
                                    activeOpacity={0.8}
                                    key={item.id}
                                    title={item.name}

                                    // passo o id para o estado
                                    onPress={ () => setSize(item.id) }
                                    // e aqui se o size tiver um item.id no estado,
                                    // já transforma o selected em true.
                                    selected={ size === item.id }
                                />
                            ))
                        }
                    </Sizes>

                    <FormRow>
                        <InputGroup>
                            <Label>Número da mesa</Label>
                            <Input keyboardType='numeric' onChangeText={setTableNumber} />
                        </InputGroup>

                        <InputGroup>
                            <Label>Quantidade</Label>
                            <Input 
                                keyboardType='numeric' 
                                onChangeText={ (value) => setQuantity(Number(value)) } 
                            />
                        </InputGroup>
                    </FormRow>

                    <Price>Valor de R$ {amount} </Price>
                    
                    <Button
                        title='Confirmar pedido'
                        onPress={handleOrder}
                        isLoading={sendingOrder}
                    />
                </Form>

            </ContentScroll>

        </Container>
    );
}