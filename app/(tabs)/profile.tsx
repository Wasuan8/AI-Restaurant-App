import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAuthToken } from '../../services/tokenStore'; // ✅ proper import

export default function Profile() {
  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            clearAuthToken(); // ✅ clears token before navigating
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F6F2' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={{ fontSize: 24, fontFamily: 'Sora-SemiBold', color: '#1A1A1A', marginBottom: 30, marginTop: 10 }}>
          My Profile
        </Text>

        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: '#C57C3E', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
          }}>
            <Ionicons name="person" size={48} color="#FFF" />
          </View>
          <Text style={{ fontSize: 20, fontFamily: 'Sora-SemiBold', color: '#1A1A1A' }}>Coffee Lover</Text>
          <Text style={{ fontSize: 14, fontFamily: 'Sora-Regular', color: '#AAAAAA', marginTop: 4 }}>customer@apnacafe.com</Text>
        </View>

        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8,
          marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
        }}>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F6F2', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person-outline" size={18} color="#1A1A1A" />
            </View>
            <Text style={{ marginLeft: 16, fontFamily: 'Sora-SemiBold', fontSize: 15, color: '#1A1A1A', flex: 1 }}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F6F2', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="location-outline" size={18} color="#1A1A1A" />
            </View>
            <Text style={{ marginLeft: 16, fontFamily: 'Sora-SemiBold', fontSize: 15, color: '#1A1A1A', flex: 1 }}>Address</Text>
            <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F6F2', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="notifications-outline" size={18} color="#1A1A1A" />
            </View>
            <Text style={{ marginLeft: 16, fontFamily: 'Sora-SemiBold', fontSize: 15, color: '#1A1A1A', flex: 1 }}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16,
            borderWidth: 1.5, borderColor: '#FFEBEE',
            shadowColor: '#EF5350', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={{ marginLeft: 10, fontFamily: 'Sora-SemiBold', fontSize: 16, color: '#E53935' }}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}