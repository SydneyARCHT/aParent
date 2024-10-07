import * as React from 'react';
import { Avatar, Card, Text, Button } from 'react-native-paper';

const AttendanceCardComponent = ({ data, onClose, onView }) => {
  const handleClosePress = () => {
    if (onClose && data.id) {
      onClose(data.id); 
    }
  };

  const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'No timestamp available';
  const status = data.on_time ? 'on time' : 'late';
  const className = data.className || 'Class';

  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Title 
        title={`${data.studentName} was ${status} to ${className}`} 
        left={(props) => <Avatar.Icon {...props} icon={data.on_time ? 'check' : 'alert'} />} 
      />
      <Card.Content>
        <Text variant="bodyMedium">{`Attendance Status: ${status}`}</Text>
        <Text variant="bodySmall" style={{ marginVertical: 8 }}>{`Class: ${className}`}</Text>
        <Text variant="labelSmall" style={{ color: '#888' }}>{timestamp}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onView}>View</Button>
        <Button onPress={handleClosePress}>Close</Button>
      </Card.Actions>
    </Card>
  );
};

export default AttendanceCardComponent;