import React, { useState } from 'react';
//KeyboardAvoidingView para teclado subir o conteúdo da tela
import { KeyboardAvoidingView, Platform } from 'react-native';

import brandImg from '@assets/brand.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/auth';

import {
    Container,
    Content,
    Title,
    Brand,
    ForgotPasswordButton,
    ForgotPasswordLabel
} from './styles';

export function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn, isLogging, forgotPassword } = useAuth();

    function handleSignIn(){
        signIn(email, password);
    };

    function handleForgotPassword(){
        forgotPassword(email)
    };

    return (
        <Container>
            
            <KeyboardAvoidingView
                // se for android, undefined. pq android já sabe lidar com isso
                behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
            >   

                <Content>

                    <Brand source={brandImg} />

                    <Title>Login</Title>

                    <Input
                        placeholder="E-mail"
                        type="secondary"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />

                    <Input
                        placeholder="Senha"
                        type="secondary"
                        autoCorrect={false}
                        autoCapitalize="none"
                        secureTextEntry
                        onChangeText={setPassword}
                    />

                    <ForgotPasswordButton onPress={handleForgotPassword}>
                        <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
                    </ForgotPasswordButton>

                    
                    <Button 
                        title="Entrar" 
                        type='secondary'
                        onPress={handleSignIn}

                        // como no componente desse botão coloquei uma propriedade para
                        // o isLoading, eu chamo ela aqui para o isLogging
                        // para controlar, quando estiver carregando alguma coisa ele ativa o loading
                        isLoading={isLogging}
                    />

                </Content>

            </KeyboardAvoidingView>

        </Container>
    );
}