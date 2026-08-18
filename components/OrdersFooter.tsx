import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrdersFooterProps {
    totalPrice: number;
}

const OrdersFooter: React.FC<OrdersFooterProps> = ({ totalPrice }) => {
    return (
        <>
            <View style={styles.divider} />
            <Text style={styles.title}>
                Payment Summary
            </Text>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Price
                </Text>
                <Text style={styles.value}>
                    ₹{totalPrice}
                </Text>
            </View>

            <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.label}>
                    Delivery Fee
                </Text>
                <Text style={styles.value}>
                    ₹{totalPrice === 0 ? 0 : 1}
                </Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 4,
        borderBottomColor: '#F9F2ED',
        marginTop: 12,
    },
    title: {
        marginHorizontal: 28,
        color: '#242424',
        fontSize: 18,
        fontFamily: 'Sora-SemiBold',
        marginBottom: 16,
        marginTop: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 28,
        marginBottom: 12,
    },
    rowLast: {
        paddingBottom: 32,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Sora-Regular',
    },
    value: {
        fontSize: 16,
        fontFamily: 'Sora-SemiBold',
    },
});

export default OrdersFooter;