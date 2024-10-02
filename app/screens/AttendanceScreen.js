import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { CalendarList } from 'react-native-calendars'; 


function AssignmentsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CalendarList
          horizontal={true}
          pagingEnabled={true}
          calendarWidth={320}
          minDate={'2024-08-01'} 
          maxDate={'2025-05-31'} 
          pastScrollRange={2} 
          futureScrollRange={9} 
          showScrollIndicator={true} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AssignmentsScreen;