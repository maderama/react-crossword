// CrosswordQuestions.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CrosswordEntry = {
    answer: string;
    startx: number;
    starty: number;
    orientation: 'across' | 'down';
    hint: string;
    position: number;
};

type CrosswordQuestionsProps = {
    crosswordData: CrosswordEntry[][];
    level: number;
};

const CrosswordQuestions: React.FC<CrosswordQuestionsProps> = ({ crosswordData, level }) => {
    const questions = { across: [], down: [] } as { [key: string]: JSX.Element[] };

    crosswordData[level]?.forEach(({ hint, orientation, position }) => {
        const questionText = `${position}. ${hint}`;
        questions[orientation].push(
            <Text key={`question-${position}`} style={styles.questionText}>
                {questionText}
            </Text>
        );
    });

    return (
        <View>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Across</Text>
            </View>
            <View style={styles.questionsContainer}>{questions.across}</View>

            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Down</Text>
            </View>
            <View style={styles.questionsContainer}>{questions.down}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    headingContainer: { marginTop: 10, marginBottom: 5 },
    headingText: { fontSize: 24, fontWeight: 'bold', color: '#e27bb1', textAlign: 'left' },
    questionsContainer: { marginBottom: 50, padding: 10 },
    questionText: { fontSize: 18, fontStyle: 'italic', color: 'white', letterSpacing: 0.5, lineHeight: 30 },
});

export default CrosswordQuestions;
