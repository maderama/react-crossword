import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CrosswordGrid from "./CrosswordGrid";
import crosswordData from "./crosswordData";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <Text style={styles.welcomeText}>The Art of Being a Great Colleague Crossword</Text>
            </View>
            <CrosswordGrid crosswordData={crosswordData} />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#282828',
        flex: 1,
    },
    messageContainer: {
        padding: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,        // Increase or decrease font size as desired
        fontWeight: 'bold',  // Make the text bold
        color: '#e44b8d',       // Set text color (change to any color you like)
        textAlign: 'center', // Center align the text
    },
    content: {
        flex: 1,
    },
});

export default Layout;
