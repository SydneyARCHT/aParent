import * as React from 'react';
import { useState, useEffect } from 'react';
import { Drawer } from 'react-native-paper';
import { ScrollView, StyleSheet, SafeAreaView, Alert, View, Text, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../../config/firebaseConfig';

const TeacherDrawerComponent = ({ navigation }) => {
  const [active, setActive] = useState('');
  const [teacherFirstName, setTeacherFirstName] = useState('');
  const [teacherAvatar, setTeacherAvatar] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(database, 'users', user.uid); 
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.userType === 'teacher') {
            const firstName = userData.name.split(' ')[0];
            setTeacherFirstName(firstName || 'Teacher'); 
            setTeacherAvatar(userData.avatar || 'https://i.pravatar.cc/300'); 
          }
        }
      }
    };

    fetchTeacherData();
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
            <Image source={{ uri: teacherAvatar }} style={styles.avatar} />
            <Text style={styles.title}>{teacherFirstName}</Text>
          </View>
          <Drawer.Item
            label="Profile"
            active={active === 'first'}
            onPress={() => {
              setActive('first');
              navigation.navigate('FirstScreen');
            }}
          />
          <Drawer.Item
            label="Account Settings"
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

export default TeacherDrawerComponent;