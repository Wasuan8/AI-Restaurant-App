import { router } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ThankyouPage = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Thank you For Your Order</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.buttonText}>Return to Home Page</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Sora-SemiBold',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  button: {
    backgroundColor: '#C67C4E',
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Sora-Regular',
  },
});

export default ThankyouPage