import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from './DrawerComponent';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="FirstScreen" component={FirstScreen} />
      <Drawer.Screen name="SecondScreen" component={SecondScreen} />
      {/* <Drawer.Screen name="Welcome" component={WelcomeScreen} /> */}
    </Drawer.Navigator>
  );
}

export default AppDrawer;