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
    // Initialize the grid with '0' for blocked cells
    const initialGrid = Array(14).fill(0).map(() => Array(14).fill('0'));

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

    // Replace empty cells with '8' to represent black cells
    for (let row = 0; row < initialGrid.length; row++) {
        for (let col = 0; col < initialGrid[row].length; col++) {
            if (initialGrid[row][col] === '') {
                initialGrid[row][col] = ''; // Keep it empty for user input
            } else if (initialGrid[row][col] === '0') {
                initialGrid[row][col] = '8'; // Mark with '8' for solid black
            }
        }
    }

    return initialGrid;
};

const generateAnswerGrid = (crosswordData: CrosswordEntry[][]): string[][] => {
    const answerGrid = Array(14).fill(0).map(() => Array(14).fill('0'));
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

    const RenderGrid = () => (
        <View>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        const clueNumber = crosswordData[level].find(entry => {
                            const {startx, starty, orientation} = entry;
                            return (
                                (orientation === 'across' && rowIndex + 1 === starty && colIndex + 1 === startx) ||
                                (orientation === 'down' && rowIndex + 1 === starty && colIndex + 1 === startx)
                            );
                        });

                        return (
                            <View key={`${rowIndex}-${colIndex}`} style={styles.cellContainer}>
                                {cell === '8' ? (
                                    <View style={styles.solidCell}/>
                                ) : (
                                    <TextInput
                                        style={[styles.cell, cell === '0' && styles.staticCell]}
                                        value={cell}
                                        editable={cell !== '0'}
                                        onChangeText={(text) => handleInputChange(rowIndex, colIndex, text)}
                                        maxLength={1}  // Limit input to 1 character
                                        autoCapitalize="characters"
                                    />
                                )}
                                {clueNumber && cell !== '8' && (
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
        const upperText = text.toUpperCase(); // Convert input to uppercase
        console.log(`Input received: '${upperText}'`); // Log the input received
        if (upperText.length === 1 || upperText === '') {
            setGrid((prevGrid) => {
                const updatedGrid = [...prevGrid];
                // Only update the cell if the text is not empty
                if (upperText.length === 1) {
                    updatedGrid[rowIndex][colIndex] = upperText;  // Update the specific cell in uppercase
                } else if (upperText === '') {
                    updatedGrid[rowIndex][colIndex] = '';  // Ensure it resets to an empty string
                }
                console.log(`Updated grid cell [${rowIndex}, ${colIndex}]: '${updatedGrid[rowIndex][colIndex]}'`); // Log the updated value
                return updatedGrid;  // Return the updated grid
            });
        }
    };

    return (
        <View style={styles.container}>
            <RenderGrid />
            <View style={styles.buttonContainer}>
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
        width: 40,
        height: 40,
        textAlign: 'center',
        color: 'white',
    },
    staticCell: {borderColor: '#e44b8d', color: 'transparent', backgroundColor: '#e27bb1',},
    smallDigit: {position: 'absolute', top: 2, left: 2, fontSize: 10, fontWeight: 'bold', color: 'white'},

    questionsContainer: {marginBottom: 50, padding: 10},
    questionText: {fontSize: 14, fontStyle: 'italic', color: 'white'},

    headingContainer: {marginTop: 10, marginBottom: 5},
    headingText: {fontSize: 18, fontWeight: 'bold', color: '#e27bb1', textAlign: 'center'},

    buttonContainer: {flexDirection: 'row', marginTop: 20},
    gap: {width: 10},
    solidCell: {
        borderWidth: 1,
        margin: 0,
        borderColor: '#e44b8d',
        backgroundColor: '#e27bb1',
        width: 40,
        height: 40,
        textAlign: 'center',
    },
});

export default CrosswordGrid;
