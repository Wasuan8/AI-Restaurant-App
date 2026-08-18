import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import React from 'react'

interface DetailsInterface {
    description: string;
}

const DescriptionSection = ({ description }: DetailsInterface) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.outerContainer}>
            <Text style={styles.title}>Description</Text>

            <View style={styles.container}>
                <Text style={styles.content}>
                    {expanded ? description : `${description.slice(0, 100)}...`}
                </Text>
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.readMore}>
                        {expanded ? ' Read Less' : 'Read More'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        marginTop: 8,
    },
    title: {
        color: '#242424',
        fontSize: 18,
        fontFamily: 'Sora-SemiBold',
        marginLeft: 4,
    },
    container: {
        padding: 8,
    },
    content: {
        color: '#A2A2A2',
        fontSize: 12,
        fontFamily: 'Sora-Regular',
        lineHeight: 18,
    },
    readMore: {
        color: '#C67C4E',
        fontSize: 12,
        fontFamily: 'Sora-Regular',
    },
});

export default DescriptionSection;