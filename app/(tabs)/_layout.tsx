import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: '#C67C4E',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          height: 70,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight:'700',
          fontFamily: 'Sora-Regular',
          marginTop: 2,
        },
      }}
      >
        <Tabs.Screen
          name='home'
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -10,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#C67C4E',
                }} />
              )}
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
        />

        <Tabs.Screen
          name='chatRoom'
          options={{
            headerShown: true,
            tabBarStyle: { display: 'none' },
            title: 'AI Bot',
            tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -10,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#C67C4E',
                }} />
              )}
              <Ionicons
                name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
          
        />

        <Tabs.Screen
          name='order'
          options={{
            headerShown: true,
            tabBarStyle: { display: 'none' },
            title: 'Cart',
           tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -10,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#C67C4E',
                }} />
              )}
              <Ionicons
                name={focused ? 'bag' : 'bag-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            headerShown: false,
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -10,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#C67C4E',
                }} />
              )}
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout