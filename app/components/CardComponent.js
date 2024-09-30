import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Provider as PaperProvider, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import { useState, useEffect } from 'react';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e91e63',
  },
};



const CardComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result); 
      } catch (error) {
        setError(error.message); 
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyMedium">Failed to load data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> 
        <Card.Content style={styles.content}>
          <Text variant="titleLarge">{data?.title || 'Field Trip Coming!'}</Text>
          <Text variant="bodyMedium">{data?.body || 'Class 1A has a field trip coming up! The trip will take place in ...'}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Read More clicked!')}>Read More</Button>
        </Card.Actions>
      </Card>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
  },
  content: {
    paddingVertical: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardComponent;