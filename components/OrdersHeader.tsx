import { StyleSheet, Text, View } from 'react-native'
import DeliveryToggle from './DeliveryToggle'
import React from 'react'

const OrdersHeader = () => {
    return (
        <View>
            <DeliveryToggle />

            <Text style={styles.headerTitle}>
                Delivery Address
            </Text>
            <Text style={styles.addressName}>
                Jl. Kpg Sutoyo
            </Text>
            <Text style={styles.addressDetail}>
                Kpg. Sutoyo No. 620, Bilzen, Tanjungbalai.
            </Text>

            <View style={styles.divider} />
        </View>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        marginHorizontal: 28,
        marginTop: 28,
        color: '#242424',
        fontSize: 18,
        fontFamily: 'Sora-SemiBold',
    },
    addressName: {
        marginHorizontal: 28,
        marginTop: 12,
        color: '#242424',
        fontSize: 16,
        fontFamily: 'Sora-SemiBold',
        marginBottom: 8,
    },
    addressDetail: {
        marginHorizontal: 28,
        color: '#A2A2A2',
        fontSize: 12,
        fontFamily: 'Sora-SemiBold',
        marginBottom: 12,
    },
    divider: {
        marginHorizontal: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#9CA3AF',
        marginVertical: 16,
    },
});

export default OrdersHeader