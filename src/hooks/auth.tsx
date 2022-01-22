import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
} from 'react';
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// aqui já começa a parte de ver se o user é admin ou garçom
type User = {
    id: string,
    name: string,
    isAdmin: boolean;
}

type AuthContextData = {
    // é uma função que retorna uma promisse, 
    //e a promisse é um void que não retorna nenhum conteúdo
    signIn: ( email: string, password: string ) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (email : string) => Promise<void>;
    isLogging: boolean;
    user: User | null;
};

type AuthProviderProps = {
    children: ReactNode;
};

// criando uma chave para o async storage
const USER_COLLECTION = '@pizzaria:users';

// o estado inicial do nosso contexto é(as) AuthContextData
export const AuthContext = createContext({} as AuthContextData);

function AuthProvider( {children} : AuthProviderProps ){
    const [isLogging, setIsLogging] = useState(false);

    // está tipado <User | null>, ou ele é user ou é null
    // começa null por padrão
    const [user, setUser] = useState<User | null>(null)

    // logando user
    async function signIn(email: string, password: string) {
        if(!email || !password) {
            return Alert.alert('Login', 'Informe o e-mail e a senha')
        }

        setIsLogging(true);

        await auth().signInWithEmailAndPassword(email, password)

        // pegando usuário
        .then(account => {
            firestore()
            .collection('users')
            .doc(account.user.uid)
            .get()
            .then( async (profile) => {
                const { name, isAdmin } = profile.data() as User;

                if(profile.exists){ //profile.exists, se o usuário existe
                    const userData = {
                        id: account.user.uid,
                        name,
                        isAdmin
                    };
                    setUser(userData);
                    // sanvando no async storage
                    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData));
                }
            })
            .catch(() => Alert.alert(
                'Login', 'Não foi possível buscar os dados de perfil do usuário'
            ));
        })
        .catch(error => {
            const { code } = error;

            if(code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                return Alert.alert('Login', 'E-mail e/ou senha inválida.')
            }
            else {
                return Alert.alert('Login', 'Não foi possível realizar o login.')
            }
        })
        .finally( () => setIsLogging(false) );
    };

    // carregando dados do user do async storage
    async function loadUserStorageData(){
        setIsLogging(true);

        const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

        if(storedUser){
            const  userData = JSON.parse(storedUser) as User; //passo a chamar de User
            setUser(userData);
        };

        setIsLogging(false);
    };

    // deslogar
    async function signOut(){
        await auth().signOut();

        // deletar os dados de autenticação do user no dispositivo
        await AsyncStorage.removeItem(USER_COLLECTION);
        setUser(null); // limpando o estado user
    };

    // recuperar senha
    async function forgotPassword(email: string){
        if(!email){
            return Alert.alert('Redefinir senha', 'Informe o e-mail.');
        };

        await auth()
        .sendPasswordResetEmail(email)
        .then( () => Alert.alert('Redefinir senha', 'Enviamos um link no seu e-mail para redefinir sua senha.'))
        .catch(() => Alert.alert('Redefinir senha', 'Não foi possível enviar e-mail para recuperação.'))
    };

    useEffect( () => {
        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            forgotPassword,
            isLogging,
        }}>
            {children}
        </AuthContext.Provider>
    )
};

function useAuth(){
    const context = useContext(AuthContext);

    return context;
};

export { AuthProvider, useAuth };