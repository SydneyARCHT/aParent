import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { collection, getDocs, query, where, orderBy, doc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import DrawerComponent from '../navigation/DrawerComponent';
import CardComponent from '../components/CardComponent';

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    const fetchParentId = async () => {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(database, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          if (userData.userType === 'parent') {
            setParentId(userDoc.id);
          }
        }
      }
    };

    fetchParentId();
  }, []);

  const fetchData = async () => {
    if (!parentId) return;

    try {
      const parentDocRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentDocRef));
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student);

      console.log('Student References:', studentRefs);

      if (studentRefs.length === 0) {
        console.log('No students found for this parent.');
        setData([]);
        return;
      }

      const classStudentQuery = query(collection(database, 'class_student'), where('student', 'in', studentRefs));
      const classStudentSnapshot = await getDocs(classStudentQuery);

      console.log('Class-Student Documents:');
      classStudentSnapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });

      const classRefs = classStudentSnapshot.docs.map(doc => doc.data().class);

      console.log('Class References:', classRefs);

      if (classRefs.length === 0) {
        console.log('No classes found for these students.');
        setData([]);
        return;
      }

      const assignmentsQuery = query(
        collection(database, 'assignments'),
        where('class', 'in', classRefs),
        orderBy('date_created', 'desc')
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);

      console.log('Assignment Documents:');
      assignmentsSnapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });

      const assignments = assignmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setData(assignments);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parentId]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#e91e63']}
          />
        }
      >
        <View style={styles.container}>
          {data.map((item, index) => (
            <CardComponent key={index} data={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ParentScreen = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Home" component={ParentScreenContent} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
  },
});

export default ParentScreen;