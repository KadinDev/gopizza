import React, {useState, useEffect} from 'react';
import { Platform, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import {
    Container,
    Header,
    Title,
    DeleteLabel,
    Upload,
    PickeImageButton,
    Label,
    InputGroup,
    InputGroupHeader,
    MaxCharacters,
    Form,
} from './styles';

import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { useRoute, useNavigation } from '@react-navigation/native';
// eu pego a tipagem que criei
import { ProductNavigationProps } from '@src/@types/navigation';

import { ButtonBack } from '@components/ButtonBack';
import { Photo } from '@components/Photo';
import { InputPrice } from '@components/InputPrice';
import { Button } from '@components/Button';

// o mesmo input que fiz para a tela de login
import { Input } from '@components/Input';

import { ProductProps } from '@components/ProductCard';
// pego a mesma tipagem que fiz no ProductCard passando ela para 
// PizzaResponse, e digo que ela terá mais algumas coisas ( & )
type PizzaResponse = ProductProps & {
    photo_path: string;
    prices_sizes: {
        p: string;
        m: string;
        g: string;
    }
}

export function Product(){
    // aqui terei onde a foto está armazenada para deletar ela onde ela estiver
    const [photoPath, setPhotoPath] = useState('');

    const [image, setImage] = useState(''); //aqui terei somente o link da foto
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priceSizeP, setPriceSizeP] = useState('');
    const [priceSizeM, setPriceSizeM] = useState('');
    const [priceSizeG, setPriceSizeG] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    // uso o useRoute para mim acessar o que vem pela rota
    const route = useRoute();
    // pego o id que está vindo pela rota e digo que a tipagem dele
    // será a que criei (ProductNavigationProps)
    const { id } = route.params as ProductNavigationProps;


    async function handlePickerImage(){
        // para pedir permissão ao user para acessar as fotos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if( status === 'granted' ) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                
                //aspecto da imagem 4 x 4
                aspect: [ 4, 4]
            });

            if(!result.cancelled){
                setImage(result.uri);
            }
        }
    };

    async function handleAdd(){
        // .trim(), remove os espaços. se ao invés de digitar apertar espaço,
        // ele não permitirá, só mesmo quando digitar algum nome
        if(!name.trim()){
            return Alert.alert('Cadastro', 'Informe o nome da pizza.');
        };
        if(!description.trim()){
            return Alert.alert('Cadastro', 'Informe a descrição da pizza.');
        };
        if(!image){
            return Alert.alert('Cadastro', 'Selecione a imagem da pizza.');
        };
        if( !priceSizeP || !priceSizeM || !priceSizeG ){
            return Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da pizza.');
        };

        setIsLoading(true);

        // upload da imagem
        const fileName = new Date().getTime();

        // criei essa pasta logo no firebase
        // estou criando uma pasta /pizzas/
        const reference = storage().ref(`/pizzas/${fileName}.png`);

        await reference.putFile(image); // e passo a imagem

        // aqui é onde tenho a URL da foto
        // OBS: como estou desenvolvendo essa tela e não estou autenticado
        // na aplicação, eu fui em Rules do Storage e tirei esse parte do code:
        // : if request.auth != null; - para não me barrar
        const photo_url = await reference.getDownloadURL();

        // agora salva no banco
        firestore()
        .collection('pizzas')
        .add({
            name,

            // estou salvando esse name_insensitive que será o nome todo em minusculo
            // .trim() e estou removendo todos os espaços, pq irei usar esse campo
            // para pesquisar pelo nome do produto, um ótimo macete / dica
            name_insensitive: name.toLowerCase().trim(),
            description,
            prices_sizes: { // vou salvar em array
                p: priceSizeP,
                m: priceSizeM,
                g: priceSizeG
            },
            photo_url,
            //photo_path é em que pasta essa foto está salva
            photo_path: reference.fullPath
        })
        .then( () => navigation.navigate('home') )
        .catch( () => setIsLoading(false) )

        setImage('');
        setName('');
        setDescription('');
        setPriceSizeP('');
        setPriceSizeM('');
        setPriceSizeG('');
    };

    function handleGoBack(){
        navigation.goBack();
    };

    function handleDelete(){
        firestore()
        .collection('pizzas')
        .doc(id)
        .delete()
        .then(() => {
            storage()
            .ref(photoPath)
            .delete()
            .then(() => navigation.navigate('home'));
        });
    };

    useEffect( () => {
        // se tem o id, vai acessar o produto no formulario,
        // se não tem vai pro formulario vazio para cadastro
        if(id){
            firestore()
            .collection('pizzas')
            .doc(id) // selcionando um documento apenas
            .get()
            .then(response => {
                const product = response.data() as PizzaResponse;

                setName(product.name);
                setImage(product.photo_url);
                setDescription(product.description);
                setPriceSizeP(product.prices_sizes.p);
                setPriceSizeM(product.prices_sizes.m);
                setPriceSizeG(product.prices_sizes.g);
                setPhotoPath(product.photo_path);
            })
        }
    },[id]); // id como dependencia

    return (
        <Container
        behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <Header>

                    <ButtonBack
                        onPress={handleGoBack}
                    />

                    <Title>Cadastrar</Title>

                    { !id ? (
                        // a ideia da view é para substituir a largura do botao deletar
                        // senão o nome cadastrar vai para o final da tela, pois vai estar
                        // seguindo o styles dele
                        <View style={{width: 30}}/>
                    ) : (
                        <TouchableOpacity
                            onPress={handleDelete}
                        >
                            <DeleteLabel>Deletar</DeleteLabel>
                        </TouchableOpacity>
                    ) }

                </Header>

                <Upload>
                    
                    <Photo uri={image} />
                    
                    { !id && 
                        <PickeImageButton
                            // esse é o botão que criei antes, que tem o primary e o secondary como opções
                            title='Carregar'
                            type='secondary'
                            onPress={handlePickerImage}
                        />
                    }

                </Upload>

                <Form>
                    <InputGroup>
                        <Label>Nome</Label>

                        <Input 
                            onChangeText={setName} 
                            value={name} 
                        />

                    </InputGroup>

                    <InputGroup>
                        <InputGroupHeader>
                            <Label >Descrição</Label>
                            <MaxCharacters> {description.length} de 60 caracteres </MaxCharacters>                    
                        </InputGroupHeader>

                        <Input
                            multiline
                            maxLength={60}
                            style={{ height: 80 }}

                            onChangeText={setDescription} 
                            value={description}
                        />

                    </InputGroup>

                    <InputGroup>
                        <Label> Tamanhos e preços </Label>
                        
                        <InputPrice 
                            size='P'
                            onChangeText={setPriceSizeP}
                            value={priceSizeP}
                        />

                        <InputPrice 
                            size='M'
                            onChangeText={setPriceSizeM}
                            value={priceSizeM}
                        />

                        <InputPrice 
                            size='G'
                            onChangeText={setPriceSizeG}
                            value={priceSizeG}
                        />
                        

                    </InputGroup>

                    {
                        !id &&
                        <Button 
                            title='Cadastrar Pizza' 
                            type='secondary' 
                            isLoading={isLoading}

                            onPress={handleAdd}
                        />
                    }

                </Form>

            </ScrollView>
            
        </Container>
    );
}