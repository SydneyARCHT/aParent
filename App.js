// import React, { createContext, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import WelcomeScreen from './app/screens/WelcomeScreen';
// import LoginScreen from './app/screens/LoginScreen';
// import MyTabs from './app/navigation/BottomNavBar';
// import TeacherScreen from './app/screens/TeacherScreen';
// import RegisterScreen from './app/screens/RegisterScreen';

// import { Provider } from 'react-redux';

// const Stack = createStackNavigator();
// const AuthenticatedUserContext = createContext({});

// const AuthenticatedUserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   return (
//     <AuthenticatedUserContext.Provider value={{user, setUser}}>
//       {children}
//     </AuthenticatedUserContext.Provider>
//   )
// }

// export default function App() {
//   return (
//       <AuthenticatedUserProvider>
//         <NavigationContainer>
//           <Stack.Navigator screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="Welcome" component={WelcomeScreen} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//             <Stack.Screen name="Teacher" component={TeacherScreen} />
//             <Stack.Screen name="Parent" component={MyTabs} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </AuthenticatedUserProvider>
//   );
// }

import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './app/config/firebaseConfig';
import { Provider } from 'react-redux';
import store from './app/store';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import TeacherScreen from './app/screens/TeacherScreen';
import MyTabs from './app/navigation/BottomNavBar'; 

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Teacher" component={TeacherScreen} />
      <Stack.Screen name="Parent" component={MyTabs} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
      setIsLoading(false);
    });
    return unsubscribeAuth; 
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </Provider>
  );
}