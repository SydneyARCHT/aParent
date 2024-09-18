import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e91e63', 
  },
};

const CardComponent = () => (
  <PaperProvider theme={theme}>
    <Card style={styles.card}>
      <Card.Cover source={{ uri: 'https://picsum.photos/id/17/700' }} />
      <Card.Content style={styles.content}>
        <Text variant="titleLarge">Field Trip Coming!</Text>
        <Text variant="bodyMedium">Class 1A has a field trip coming up! The trip will take place in ...</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Read More</Button>
      </Card.Actions>
    </Card>
  </PaperProvider>
);

const styles = StyleSheet.create({
    card: {
      margin: 15,
    },
    content: {
      paddingVertical: 16,
    },
  });
  
  export default CardComponent;