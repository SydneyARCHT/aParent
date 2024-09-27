import * as React from 'react';
import { Drawer } from 'react-native-paper';
import { ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; 

const DrawerComponent = ({ navigation }) => {  
  const [active, setActive] = React.useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.navigate('Welcome'); 
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Logout Error', 'There was an issue logging out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <ScrollView>
        <Drawer.Section title="Parent Username Here" style={styles.drawerSection}>
          <Drawer.Item
            label="First Item"
            active={active === 'first'}
            onPress={() => {
              setActive('first');
              navigation.navigate('FirstScreen'); 
            }}
          />
          <Drawer.Item
            label="Second Item"
            active={active === 'second'}
            onPress={() => {
              setActive('second');
              navigation.navigate('SecondScreen'); 
            }}
          />
          <Drawer.Item
            label="Log Out"
            onPress={handleLogout}
          />
        </Drawer.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1, 
    paddingTop: 20, 
  },
  drawerSection: {
    paddingVertical: 0, 
  },
});

export default DrawerComponent;