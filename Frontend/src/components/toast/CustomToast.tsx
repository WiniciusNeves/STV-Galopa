import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomToastProps {
    text1: string;
    text2?: string;
    backgroundColor: string;
    borderColor: string;
}
const CustomToast = ({ text1, text2, backgroundColor, borderColor }: CustomToastProps) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.border, { backgroundColor: borderColor }]} />
            <View style={styles.textContainer}>
                <Text style={styles.text1}>{text1}</Text>
                {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 5,
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    border: {
        width: 5,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    text1: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    text2: {
        color: '#fff',
        fontSize: 13,
        marginTop: 4,
    },
});

export default CustomToast;
