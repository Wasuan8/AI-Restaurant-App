import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, Stack } from 'expo-router';

interface HeaderProps {
    title: string;
    showHeaderRight: boolean;
    bgColor: string;
    rightIcon?: string;
    onPressRight?: () => void;
}

const PageHeader: React.FC<HeaderProps> = ({ title, showHeaderRight, bgColor, rightIcon, onPressRight }) => {
    return (
        <Stack.Screen
            options={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTitleAlign: 'center',
                headerTitle: () => (
                    <Text style={styles.headerTitle}>
                        {title}
                    </Text>
                ),
                headerRight: showHeaderRight
                    ? () => (
                        <TouchableOpacity 
                            style={{ marginRight: 10, padding: 5 }} 
                            onPress={onPressRight}
                            activeOpacity={0.7}
                        >
                            <FontAwesome5
                                name={rightIcon || "heart"}
                                size={22}
                                color={rightIcon === "trash-alt" ? "#A32D2D" : "black"}
                            />
                        </TouchableOpacity>
                    )
                    : undefined,
                headerBackVisible: false,
                headerLeft: () => (
                    <GestureHandlerRootView style={styles.headerLeftContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Feather name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>
                    </GestureHandlerRootView>
                ),
            }}
        />
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 20,
        color: '#242424',
        fontFamily: 'Sora-SemiBold',
    },
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        paddingLeft: 8,
    },
});

export default PageHeader;