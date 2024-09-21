import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ParentScreen from '../screens/ParentScreen';
import MessagesScreen from '../screens/MessagesScreen';
import GradesScreen from '../screens/GradesScreen'
import ParentResourcesScreen from '../screens/ParentResourceScreen';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Parent"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: '' }}
    >
      <Tab.Screen
        name="Home"
        component={ParentScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="message-processing" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentBoard"
        component={GradesScreen}
        options={{
          tabBarLabel: 'Grades',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="abacus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ParentResources"
        component={ParentResourcesScreen}
        options={{
          tabBarLabel: 'Parent     Resources',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-child-circle" color={color} size={26} /> 
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;