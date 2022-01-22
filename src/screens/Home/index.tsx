import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Alert, FlatList } from 'react-native';
import {
    Container,
    Header,
    Greeting,
    GreetingEmoji,
    GreetingText,
    Title,
    MenuHeader,
    MenuItemsNumber,
    NewProductButton
} from './styles';

import happyEmoji from '@assets/happy.png';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';

export function Home(){
    const [pizzas, setPizzas] = useState<ProductProps[]>([]);
    const [search, setSearch] = useState('');
    
    const { COLORS } = useTheme();
    const navigation = useNavigation();

    const { signOut, user } = useAuth();


    // buscando todas as pizzas cadastradas para pesquisar
    // além de trazer todas as pizzas registradas, vou poder usar esse fetchPizzas para o search
    // como value(valor) eu falo que será uma string 
    function fetchPizzas(value: string){
        const formattedValue = value.toLocaleLowerCase().trim();

        firestore()
        .collection('pizzas')
        .orderBy('name_insensitive')
        .startAt(formattedValue)
        .endAt(`${formattedValue}\uf8ff`)
        .get()
        .then(response => {
            const data = response.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                }
            }) as ProductProps[]; // pego a mesma tipagem que fiz em ProductCard,
            // para não ter que criar outra novamente

            setPizzas(data);
        })
        .catch( () => Alert.alert('Consulta', 'Não foi possível realizar a consulta.'))
    };

    function handleSearch(){
        fetchPizzas(search);
        // mando o search para o fetchPizzas, como valor(value)
    };

    function handleSearchClear(){
        setSearch('');
        fetchPizzas('');
    };

    function handleOpen(id: string) {
        const route = user?.isAdmin ? 'product' : 'order';
        // o id é passado como parametro, pois assim que criei nas tipagens
        // das rotas, informando que terá um parametro
        navigation.navigate( route, { id })
    };

    function handleAdd(){
        // se eu mandar entao sem o id - {}
        // ele vai para a tela de cadastro, que é o form vazio
        navigation.navigate('product', {})
        // como no useEffect do index de Product eu coloquei o if (id) no useEffect lá.
        // como estou mandando vazio aqui ele vai para a tela de cadastro mesmo
    };

    // quando vc navega dessa tela para a outra, e volta para essa,
    // as novas alterações não serão mostradas pois essa tela já fica aberta
    // quando vai para outra tela, ou seja, vc vai voltar para a tela aberta, ele não terá o reload.
    // para isso usa-se o useFocusEffect (quando a tela estiver em foco novamente, vai ser atualizada,
    // trazendo assim as novas alterações.)
    useFocusEffect( 
        // o useCallback é usado com o useFocusEffect
        useCallback( () => {
        fetchPizzas('')// ('') assim já trás todas as pizzas
    
    }, [] ));

    return (
        <Container>

            <Header>
                <Greeting>
                    <GreetingEmoji source={happyEmoji} />
                    <GreetingText>Olá, { user?.name } </GreetingText>
                </Greeting>

                <TouchableOpacity
                    onPress={signOut}
                >
                    <MaterialIcons name='logout' color={COLORS.TITLE} size={24} />
                </TouchableOpacity>

            </Header>

            <Search
                onChangeText={setSearch}
                value={search}
                
                onSearch={ handleSearch }
                onClear={ handleSearchClear }
            />

            <MenuHeader>
                <Title>Cardápio</Title>
                <MenuItemsNumber> {pizzas.length} pizzas </MenuItemsNumber>
            </MenuHeader>

            <FlatList
                data={pizzas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductCard 
                        data={item}
                        onPress={ () => handleOpen(item.id) }
                    />
                ) }

                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 125,
                    marginHorizontal: 24,
                }}
            />
            

            { //somente se o user for admin
                user?.isAdmin && (
                    <NewProductButton
                        title='Cadastrar Pizza'
                        type='secondary'
                        onPress={handleAdd}
                    />
                )
            }

        </Container>
    );
}