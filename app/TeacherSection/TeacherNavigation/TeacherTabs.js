import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MessagesScreen from '../../screens/MessagesScreen';
import ParentResourcesScreen from '../../screens/ParentResourceScreen';
import ManageScreen from '../TeacherScreens/ManageScreen';
import TeacherScreen from '../TeacherScreens/TeacherScreen';
import TeacherStudentBoardStackScreen from '../TeacherScreens/TeacherStudentBoardStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

function TeacherTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Teacher"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: '' }}
    >
      <Tab.Screen
        name="Home"
        component={TeacherScreen}
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
        name="Manage"
        component={ManageScreen}
        options={{
          tabBarLabel: 'Manage',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-edit" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentStack"
        component={TeacherStudentBoardStackScreen}
        options={{
          tabBarLabel: 'Children',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="abacus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ParentResources"
        component={ParentResourcesScreen}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-child-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TeacherTabs;