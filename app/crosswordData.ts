// crosswordData.ts

export interface CrosswordEntry {
    answer: string;
    startx: number;
    starty: number;
    orientation: "across" | "down";
    position: number;
    hint: string;
}

const crosswordData: CrosswordEntry[][] = [
    [
        { answer: "CAT", startx: 1, starty: 1, orientation: "across", position: 1, hint: "Madison is here" },
        { answer: "DOG", startx: 1, starty: 2, orientation: "across", position: 2, hint: "A domesticated carnivorous mammal" },
        { answer: "RAT", startx: 1, starty: 3, orientation: "down", position: 2, hint: "A domesticated carnivorous mammal" }
    ],
    // Add more crossword entries as needed
];

export default crosswordData;
