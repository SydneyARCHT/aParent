import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from './app/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Provider } from 'react-redux';
import store from './app/store';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import MyTabs from './app/navigation/BottomNavBar'; 
import TeacherTabs from './app/TeacherSection/TeacherNavigation/TeacherTabs';
import { useFonts, BalsamiqSans_400Regular, BalsamiqSans_700Bold } from '@expo-google-fonts/balsamiq-sans';
import { LogBox } from 'react-native';
// Create a stack navigator

LogBox.ignoreAllLogs(true);

const Stack = createStackNavigator();

// Create a context to handle authenticated user state
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// Define the authentication stack (login, register, welcome)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async authenticatedUser => {
      setUser(authenticatedUser);

      if (authenticatedUser) {
        const userDoc = await getDoc(doc(database, 'users', authenticatedUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserType(data.userType);
        }
      }

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
      {user ? (
        userType === 'parent' ? <MyTabs /> : <TeacherTabs />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BalsamiqSans_400Regular,
    BalsamiqSans_700Bold,
  });

  // Show a fallback if the fonts are not loaded yet
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </Provider>
  );
}