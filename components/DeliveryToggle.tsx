import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const DeliveryToggle: React.FC = () => {
  const [isDelivery, setIsDelivery] = useState(true); // State to manage the selected option

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDelivery && styles.activeButton]}
        onPress={() => setIsDelivery(true)}
      >
        <Text style={[styles.text, isDelivery ? styles.activeText : styles.inactiveText]}>
          Deliver
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isDelivery && styles.activeButton]}
        onPress={() => setIsDelivery(false)}
      >
        <Text style={[styles.text, !isDelivery ? styles.activeText : styles.inactiveText]}>
          Pick Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EDEDED',
    marginHorizontal: 28,
    padding: 4,
    borderRadius: 12,
    marginTop: 28,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: '15%',
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: '#C67C4E',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: 'black',
  },
});

export default DeliveryToggle;