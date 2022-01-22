import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { UserStackRoutes } from './user.stack.routes';
import { SignIn } from '@screens/SignIn';

import { useAuth } from '@hooks/auth';

export function Routes(){
    
    // se tiver user logado vai para o UserStackRoutes
    const { user } = useAuth();
    
    return (
        <NavigationContainer>
            
            { user ? <UserStackRoutes/> : <SignIn/> }

        </NavigationContainer>
        
    );
}