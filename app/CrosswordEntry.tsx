interface CrosswordEntry {
    position: number;
    answer: string;
    hint: string;
    startx: number;
    starty: number;
    orientation: "across" | "down";  // Only accepts these specific strings
}
