import * as React from 'react';
import { Avatar, Card, Text, Button } from 'react-native-paper';

const GradeCardComponent = ({ data, onClose, onView }) => {
  const handleClosePress = () => {
    if (onClose && data.id) {
      onClose(data.id); 
    }
  };

  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Title 
        title={`${data.studentName}'s ${data.assignmentName} has been graded!`} 
        left={(props) => <Avatar.Icon {...props} icon="check-circle" />} 
      />
      <Card.Content>
        <Text variant="bodyMedium">{`Grade Given: ${data.grade}`}</Text>
        <Text variant="bodySmall" style={{ marginVertical: 8 }}>{data.feedback}</Text>
        <Text variant="labelSmall" style={{ color: '#888' }}>{new Date(data.timestamp.seconds * 1000).toLocaleString()}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onView}>View</Button>
        <Button onPress={handleClosePress}>Close</Button>
      </Card.Actions>
    </Card>
  );
};

export default GradeCardComponent;