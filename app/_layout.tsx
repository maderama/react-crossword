import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CrosswordGrid from "./CrosswordGrid";
import crosswordData from "./crosswordData";
import CrosswordQuestions from "@/app/CrosswordQuestions";

let level = 0;

const CrosswordLayout = () => {
    return (
        <View style={styles.container}>
            {/* Heading at the top */}
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>The Art of Being a Great Colleague Crossword</Text>
            </View>

            {/* Main content container with grid on the left and clues on the right */}
            <View style={styles.contentContainer}>
                {/* Crossword grid on the left */}
                <View style={styles.gridContainer}>
                    <CrosswordGrid crosswordData={crosswordData} />
                </View>

                {/* Clues on the right */}
                <View style={styles.cluesContainer}>
                    <CrosswordQuestions crosswordData={crosswordData} level={level} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282828',
    },
    headingContainer: {
        alignItems: 'center',
        paddingTop: 100,
    },
    headingText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#e27bb1',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    gridContainer: {
        flex: 2, // Takes more space than clues
        justifyContent: 'center',
        alignItems: 'center',
    },
    cluesContainer: {
        flex: 1, // Takes less space than grid
        paddingLeft: 20,
        justifyContent: 'center',
    },
});

export default CrosswordLayout;
