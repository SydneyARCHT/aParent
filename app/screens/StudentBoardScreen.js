import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerComponent from '../navigation/DrawerComponent';

const Drawer = createDrawerNavigator();
const bubbleColors = ['#5BFF9F', '#AE5BFF', '#FF6D5B', '#FFC85B', '#5DEFFF'];

// Helper function to generate random bubbles
const generateRandomBubbles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    return <AnimatedBubble key={index} />;
  });
};

const AnimatedBubble = () => {
  const { width, height } = Dimensions.get('window');
  const size = Math.random() * 100 + 50; // Random size between 50 and 150
  const backgroundColor =
    bubbleColors[Math.floor(Math.random() * bubbleColors.length)] + '50'; // Random color with transparency

  // Generate a random starting position
  const initialX = Math.random() * width;
  const initialY = Math.random() * height;
  const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  useEffect(() => {
    const moveBubble = () => {
      Animated.timing(position, {
        toValue: {
          x: position.x._value - Math.random() * 100 - 50, // Move leftward
          y: position.y._value - Math.random() * 100 - 50, // Move upward
        },
        duration: Math.random() * 4000 + 3000, // Random duration between 3s and 7s
        useNativeDriver: false,
      }).start(() => moveBubble()); // Start again for continuous movement
    };

    moveBubble();
  }, [position]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
          transform: position.getTranslateTransform(),
        },
      ]}
    />
  );
};

function StudentBoardScreenContent() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Render random colored bubbles as a background */}
      <View style={StyleSheet.absoluteFillObject}>
        {generateRandomBubbles(35)}
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Grades')}
        >
          <Text style={styles.cardText}>Grades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Behavior')}
        >
          <Text style={styles.cardText}>Behavior</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Text style={styles.cardText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Assignments')}
        >
          <Text style={styles.cardText}>Assignments</Text>
        </TouchableOpacity>
      </View>
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

const StudentBoardScreen = () => {
  const parentAvatar = 'https://i.pravatar.cc/300';

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="Children"
        component={StudentBoardScreenContent}
        options={{
          headerStyle: {
            height: 140,
          },
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <TouchableOpacity style={styles.avatarContainer} onPress={() => console.log('Avatar clicked')}>
              <Image source={{ uri: parentAvatar }} style={styles.avatar} />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, 
    height: 150,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
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
  bubble: {
    position: 'absolute',
  },
});

export default StudentBoardScreen;