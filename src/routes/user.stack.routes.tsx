import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// usando ele para saber se o user é admin ou garçom
import { useAuth } from '@hooks/auth';

import { Home } from '@screens/Home';
import { Product } from '@screens/Product';

// rotas garçom
import { Order } from '@screens/Order';
import { UserTabRoutes } from './user.tab.routes';

const { Navigator, Screen, Group } = createNativeStackNavigator();

// Group, funcionalidade nova para agrupar navegação

export function UserStackRoutes(){

    const {user} = useAuth();

    return (
        <Navigator screenOptions={{ headerShown: false }} >

            { // se o user é admin
                user?.isAdmin ? (
                    <Group>
                        <Screen name="home" component={Home} />
                        <Screen name="product" component={Product} />
                    </Group>
                ) : (

                    <Group>
                        <Screen name="UserTabRoutes" component={UserTabRoutes} />
                        <Screen name="order" component={Order} />
                    </Group>

                )
            }
            
        </Navigator>
    );
}