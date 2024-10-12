import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { auth, database } from '../config/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import DrawerComponent from '../navigation/DrawerComponent';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function ChatScreenContent({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to control ActivityIndicator
  const user = auth.currentUser;

  const colors = [
    '#5BFF9F',
    '#AE5BFF',
    '#FF6D5B',
    '#FFC85B',
    '#5DEFFF',
    '#AE5BFF',
    '#AE5BFF',
  ]; // Color list

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const parentRef = doc(database, 'parents', user.uid);
      const chatsRef = collection(database, 'chats');

      const q = query(chatsRef, where('parent_id', '==', parentRef));
      const snapshot = await getDocs(q);

      const chatDataArray = await Promise.all(
        snapshot.docs.map(async (doc, index) => {
          const chatData = doc.data();
          let userName = 'Unknown User';
          let recentMessage = '';

          // Fetch user name (teacher or parent)
          if (chatData.teacher_id) {
            try {
              const teacherDoc = await getDoc(chatData.teacher_id);
              if (teacherDoc.exists()) {
                userName = teacherDoc.data().name || 'Unknown User';
              }

              // Fetch the most recent message from the messages subcollection
              const messagesRef = collection(
                database,
                'chats',
                doc.id,
                'messages'
              );
              const messagesQuery = query(
                messagesRef,
                orderBy('timestamp', 'desc'),
                limit(1)
              );
              const messagesSnapshot = await getDocs(messagesQuery);
              if (!messagesSnapshot.empty) {
                recentMessage =
                  messagesSnapshot.docs[0].data().content || '';
              }
            } catch (error) {
              console.error('Error fetching user or message data:', error);
            }
          }

          return {
            id: doc.id,
            userName,
            recentMessage,
            avatarColor: colors[index % colors.length], // Assign color based on index
            ...chatData,
          };
        })
      );

      setChats(chatDataArray);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        // Display loading indicator when fetching data
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
        </View>
      ) : (
        <View>
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('ChatDetails', {
                    chatId: chat.id,
                    userName: chat.userName,
                  })
                }
              >
                <View
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: chat.avatarColor, // Use the assigned color
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18 }}>
                      {chat.userName
                        ? chat.userName.charAt(0).toUpperCase()
                        : '?'}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 3,
                      }}
                    >
                      {chat.userName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '300',
                        color: 'gray',
                        marginRight: 85,
                      }}
                    >
                      {chat.recentMessage}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noChatsContainer}>
              <Text style={styles.noChatsText}>No chats available</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const CustomHeaderTitle = () => {
  return (
    <View style={styles.headerTitleContainer}>
      <Text style={[styles.headerLetter, { color: '#5BFF9F' }]}>a</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>P</Text>
      <Text style={[styles.headerLetter, { color: '#FF6D5B' }]}>a</Text>
      <Text style={[styles.headerLetter, { color: '#FFC85B' }]}>r</Text>
      <Text style={[styles.headerLetter, { color: '#5DEFFF' }]}>e</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>n</Text>
      <Text style={[styles.headerLetter, { color: '#AE5BFF' }]}>t</Text>
    </View>
  );
};

const ChatScreen = () => {
  const parentAvatar = 'https://i.pravatar.cc/300';

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="Messages"
        component={ChatScreenContent}
        options={{
          headerStyle: {
            height: 140,
          },
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => console.log('Avatar clicked')}
            >
              <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLetter: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noChatsText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default ChatScreen;
