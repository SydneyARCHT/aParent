import React, { useState, useEffect } from 'react';
import { Drawer } from 'react-native-paper';
import { ScrollView, StyleSheet, SafeAreaView, Alert, View, Text, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';

const DrawerComponent = ({ navigation }) => {
  const [active, setActive] = useState('');
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentAvatar, setParentAvatar] = useState('');

  useEffect(() => {
    const fetchParentData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(database, 'users', user.uid); 
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.userType === 'parent') {
            const firstName = userData.name.split(' ')[0];
            setParentFirstName(firstName || 'Parent'); 
            setParentAvatar(userData.avatar || 'https://i.pravatar.cc/300'); 
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
            <Image source={{ uri: null }} style={styles.avatar} />
            <Text style={styles.title}>{parentFirstName}</Text>
          </View>
          <Drawer.Item
            label="Profile"
            labelStyle={styles.drawerItemLabel}
            active={active === 'first'}
            onPress={() => {
              setActive('first');
              navigation.navigate('FirstScreen');
            }}
          />
          <Drawer.Item
            label="Account Settings"
            labelStyle={styles.drawerItemLabel}
            active={active === 'second'}
            onPress={() => {
              setActive('second');
              navigation.navigate('SecondScreen');
            }}
          />
          <Drawer.Item
            label="Log Out"
            labelStyle={styles.logoutLabel}
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
    backgroundColor: '#f0f0f0', 
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    color: 'black', 
  },
  drawerItemLabel: {
    color: '#3f51b5', 
    fontSize: 16,
  },
  logoutLabel: {
    color: '#e53935', 
    fontSize: 16,
  },
});

export default DrawerComponent;