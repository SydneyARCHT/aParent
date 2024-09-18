import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from './DrawerComponent';
import LoginScreen from '../screens/LoginScreen';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="FirstScreen" component={FirstScreen} />
      <Drawer.Screen name="SecondScreen" component={SecondScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

export default AppDrawer;