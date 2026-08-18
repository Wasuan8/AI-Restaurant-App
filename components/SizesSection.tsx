import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';

const SizesSection = () => {
    const [selectedSize, setSelectedSize] = useState<String>('M');
    const sizes = ['S', 'M', 'L'];

    const handleSelect = (size: String) => {
        setSelectedSize(size);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Size</Text>

            <View style={styles.sizesContainer}>
                {sizes.map((size) => (
                    <TouchableOpacity
                        key={size}
                        onPress={() => handleSelect(size)}
                        style={[
                            styles.sizeButton,
                            selectedSize === size && styles.selectedSizeButton
                        ]}
                    >
                        <Text style={[
                            styles.sizeText,
                            selectedSize === size && styles.selectedSizeText
                        ]}>
                            {size}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        color: '#242424',
        fontSize: 18,
        fontFamily: 'Sora-SemiBold',
        marginLeft: 4,
        marginTop: 16,
    },
    sizesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 12,
        marginBottom: 12,
    },
    sizeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        width: '30%',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedSizeButton: {
        backgroundColor: '#FDF5F0',
        borderColor: '#C67C4E',
        borderWidth: 2,
    },
    sizeText: {
        fontFamily: 'Sora-Regular',
        fontSize: 16,
        color: 'black',
    },
    selectedSizeText: {
        color: '#C67C4E',
    },
});

export default SizesSection