import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Text, Button} from 'react-native';

let level = 0;

type CrosswordEntry = {
    answer: string;
    startx: number;
    starty: number;
    orientation: 'across' | 'down';
    hint: string;
    position: number;
};

type CrosswordGridProps = {
    crosswordData: CrosswordEntry[][];
};

const generateInitialGrid = (crosswordData: CrosswordEntry[][]): string[][] => {
    // Initialize the grid with 'X' for blocked cells
    const initialGrid = Array(7).fill(0).map(() => Array(8).fill('X'));

    // Mark the empty cells based on the crossword data
    crosswordData[level].forEach(({answer, startx, starty, orientation}) => {
        let x = startx - 1;
        let y = starty - 1;

        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                initialGrid[y][x + i] = ''; // Mark empty for across
            } else if (orientation === 'down') {
                initialGrid[y + i][x] = ''; // Mark empty for down
            }
        }
    });

    // Replace empty cells with 'B' to represent black cells
    for (let row = 0; row < initialGrid.length; row++) {
        for (let col = 0; col < initialGrid[row].length; col++) {
            if (initialGrid[row][col] === '') {
                initialGrid[row][col] = ''; // Keep it empty for user input
            } else if (initialGrid[row][col] === 'X') {
                initialGrid[row][col] = 'B'; // Mark with 'B' for solid black
            }
        }
    }

    return initialGrid;
};

const generateAnswerGrid = (crosswordData: CrosswordEntry[][]): string[][] => {
    const answerGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
    crosswordData[level].forEach(({answer, startx, starty, orientation}) => {
        let x = startx - 1;
        let y = starty - 1;
        for (let i = 0; i < answer.length; i++) {
            if (orientation === 'across') {
                answerGrid[y][x + i] = answer[i];
            } else if (orientation === 'down') {
                answerGrid[y + i][x] = answer[i];
            }
        }
    });
    return answerGrid;
};

const CrosswordGrid: React.FC<CrosswordGridProps> = ({crosswordData}) => {
    const [grid, setGrid] = useState<string[][]>(generateInitialGrid(crosswordData));

    useEffect(() => {
        setGrid(generateInitialGrid(crosswordData));
    }, [crosswordData]);

    const handleGenerate = () => {
        level = (level + 1) % crosswordData.length;
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleVerify = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        const isCorrect = JSON.stringify(grid) === JSON.stringify(answerGrid);
        alert(isCorrect ? 'Congratulations! Your crossword is correct.' : 'Incorrect. Please try again.');
    };

    const handleReset = () => {
        setGrid(generateInitialGrid(crosswordData));
    };

    const handleSolve = () => {
        const answerGrid = generateAnswerGrid(crosswordData);
        setGrid(answerGrid);
    };

    const renderGrid = () => (
        <View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        // Check if the cell has a clue number
                        const clueNumber = crosswordData[level].find(entry => {
                            const { startx, starty, orientation } = entry;
                            return (
                                (orientation === 'across' && rowIndex + 1 === starty && colIndex + 1 === startx) ||
                                (orientation === 'down' && rowIndex + 1 === starty && colIndex + 1 === startx)
                            );
                        });

                        return (
                            <View key={`${rowIndex}-${colIndex}`} style={styles.cellContainer}>
                                {cell === 'B' ? (
                                    <View style={styles.solidCell} />
                                ) : (
                                    <TextInput
                                        style={[styles.cell, cell === 'X' && styles.staticCell]}
                                        value={cell}  // Set to cell directly
                                        editable={cell !== 'X'}
                                        onChangeText={(text) => handleInputChange(rowIndex, colIndex, text)}
                                        maxLength={1}  // Limit input to 1 character
                                    />
                                )}
                                {clueNumber && cell !== 'B' && (
                                    <Text style={styles.smallDigit}>{clueNumber.position}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );

    const handleInputChange = (rowIndex: number, colIndex: number, text: string) => {
        console.log(`Input received: '${text}'`); // Log the input received
        if (text.length === 1 || text === '') {
            setGrid((prevGrid) => {
                const updatedGrid = [...prevGrid];
                // Only update the cell if the text is not empty
                if (text.length === 1) {
                    updatedGrid[rowIndex][colIndex] = text;  // Update the specific cell in the grid
                } else if (text === '') {
                    updatedGrid[rowIndex][colIndex] = '';  // Ensure it resets to empty string
                }
                console.log(`Updated grid cell [${rowIndex}, ${colIndex}]: '${updatedGrid[rowIndex][colIndex]}'`); // Log the updated value
                return updatedGrid;  // Return the updated grid
            });
        }
    };

    const renderQuestions = () => {
        const questions = {across: [], down: []} as { [key: string]: JSX.Element[] };

        crosswordData[level].forEach(({hint, orientation, position}) => {
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

    return (
        <View style={styles.container}>
            {renderQuestions()}
            {renderGrid()}
            <View style={styles.buttonContainer}>
                <Button color={'#e27bb1'} title="Generate" onPress={handleGenerate}/>
                <View style={styles.gap}/>
                <Button color={'#e27bb1'} title="Verify" onPress={handleVerify}/>
                <View style={styles.gap}/>
                <Button color={'#e27bb1'} title="Reset" onPress={handleReset}/>
                <View style={styles.gap}/>
                <Button color={'#e27bb1'} title="Solve" onPress={handleSolve}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    row: {flexDirection: 'row'},
    cellContainer: {position: 'relative'},
    cell: {
        borderWidth: 1,
        margin: 0,
        borderColor: '#e44b8d',
        width: 30,
        height: 30,
        textAlign: 'center',
        color: 'white',
    },
    staticCell: {borderColor: '#e44b8d', color: 'transparent', backgroundColor: '#e27bb1',},
    smallDigit: {position: 'absolute', top: 2, left: 2, fontSize: 10, fontWeight: 'bold', color: 'white'},
    questionsContainer: {marginBottom: 10, padding: 10},
    questionText: {fontSize: 16, fontStyle: 'italic', color: 'white'},
    headingContainer: {marginTop: 10, marginBottom: 5},
    headingText: {fontSize: 18, fontWeight: 'bold', color: '#e27bb1', textAlign: 'center'},
    buttonContainer: {flexDirection: 'row', marginTop: 20},
    gap: {width: 10},
    solidCell: {
        borderWidth: 1,
        margin: 0,
        borderColor: '#e44b8d',
        backgroundColor: '#e27bb1',
        width: 30,
        height: 30,
        textAlign: 'center',
    },
});

export default CrosswordGrid;
