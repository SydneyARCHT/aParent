import * as React from 'react';
import { Drawer } from 'react-native-paper';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';

const DrawerComponent = ({ navigation }) => {  
  const [active, setActive] = React.useState('');

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
            onPress={() => {
              navigation.navigate('Welcome'); 
            }}
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
