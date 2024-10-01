import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { collection, getDocs, query, where, orderBy, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebaseConfig';
import DrawerComponent from '../navigation/DrawerComponent';
import CardComponent from '../components/CardComponent';
import MessageCardComponent from '../components/MessageCardComponent';

const Drawer = createDrawerNavigator();

function ParentScreenContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const unsubscribeListeners = React.useRef([]);

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
      // Clear previous listeners
      unsubscribeListeners.current.forEach(unsub => unsub());
      unsubscribeListeners.current = [];

      const parentDocRef = doc(database, 'parents', parentId);
      const parentStudentQuery = query(collection(database, 'parent_student'), where('parent', '==', parentDocRef));
      const parentStudentSnapshot = await getDocs(parentStudentQuery);
      const studentRefs = parentStudentSnapshot.docs.map(doc => doc.data().student);

      if (studentRefs.length === 0) {
        setData([]);
        return;
      }

      const classStudentQuery = query(collection(database, 'class_student'), where('student', 'in', studentRefs));
      const classStudentSnapshot = await getDocs(classStudentQuery);

      const classRefs = classStudentSnapshot.docs.map(doc => doc.data().class);

      if (classRefs.length === 0) {
        setData([]);
        return;
      }

      const assignmentsQuery = query(
        collection(database, 'assignments'),
        where('class', 'in', classRefs),
        orderBy('date_created', 'desc')
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);

      const assignments = assignmentsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'assignment',
        timestamp: doc.data().date_created || { seconds: 0, nanoseconds: 0 }
      }));

      setData(assignments);

      // Fetch messages
      const chatsQuery = query(collection(database, 'chats'), where('parent_id', '==', parentDocRef));
      const chatsSnapshot = await getDocs(chatsQuery);

      chatsSnapshot.forEach(chatDoc => {
        const messagesQuery = query(
          collection(database, 'chats', chatDoc.id, 'messages'),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(messagesQuery, async snapshot => {
          const newMessages = await Promise.all(snapshot.docs.map(async doc => {
            const messageData = doc.data();

            let senderName = 'Unknown';
            if (messageData.sender_type === 'teacher') {
              const senderDoc = await getDoc(messageData.sender_id);
              if (senderDoc.exists()) {
                senderName = senderDoc.data().name;
              }
            } else if (messageData.sender_type === 'parent') {
              const senderDoc = await getDoc(messageData.sender_id);
              if (senderDoc.exists()) {
                senderName = senderDoc.data().name;
              }
            }

            return {
              ...messageData,
              id: doc.id,
              title: `New message from - ${senderName}`,
              type: 'message',
              timestamp: messageData.timestamp || { seconds: 0, nanoseconds: 0 },
              chatId: chatDoc.id // Add chatId to identify messages by chat
            };
          }));

          setMessages(prevMessages => {
            // Filter out old messages from the same chat to avoid duplicates
            const filteredMessages = prevMessages.filter(msg => msg.chatId !== chatDoc.id);
            return [...filteredMessages, ...newMessages];
          });
        });

        // Store unsubscribe function to detach listener later
        unsubscribeListeners.current.push(unsubscribe);
      });

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

  const combinedData = [...data, ...messages].sort((a, b) => {
    const aTimestamp = a.timestamp && a.timestamp.toDate ? a.timestamp.toDate().getTime() : 0;
    const bTimestamp = b.timestamp && b.timestamp.toDate ? b.timestamp.toDate().getTime() : 0;
    return bTimestamp - aTimestamp;
  });

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
          {combinedData.map((item, index) => (
            item.type === 'assignment' ? (
              <CardComponent key={index} data={item} />
            ) : (
              <MessageCardComponent key={index} data={item} />
            )
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