import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TeacherDrawerComponent from '../TeacherNavigation/TeacherDrawerComponent';

const Drawer = createDrawerNavigator();

function ManageBoardScreenContent() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('CreateAssignment')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Add Assignment</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('ChangeAttendance')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Change Attendance</Text>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.row}>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Card.Content>
            <Text style={styles.cardText}>Add Student</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddParent')} 
        >
          <Card.Content>
            <Text style={styles.cardText}>Add Parent</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

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
    width: '45%', 
    height: 150,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});

const ManageBoardScreen = () => {
  return (
    <Drawer.Navigator drawerContent={props => <TeacherDrawerComponent {...props} />}>
      <Drawer.Screen name="Manage" component={ManageBoardScreenContent} />
    </Drawer.Navigator>
  );
};

export default ManageBoardScreen;