import * as React from 'react';
import { useState, useEffect } from 'react';
import { Drawer } from 'react-native-paper';
import { ScrollView, StyleSheet, SafeAreaView, Alert, View, Text, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';

const DrawerComponent = ({ navigation }) => {
  const [active, setActive] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentAvatar, setParentAvatar] = useState('');

  useEffect(() => {
    const fetchParentData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          if (userData.userType === 'parent') {
            setParentName(userData.name);
            setParentAvatar(userData.avatar || 'https://i.pravatar.cc/300'); // Default avatar if none is provided
          }
        }
      }
    };

    fetchParentData();
  }, []);

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
        <Drawer.Section style={styles.drawerSection}>
          <View style={styles.userInfoSection}>
            <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            <Text style={styles.title}>{parentName}</Text>
          </View>
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
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrawerComponent;