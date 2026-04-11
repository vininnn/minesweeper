import './sevenSegments.css'

/**
 * Maps characters to their corresponding active segment.
 * On a standard 7-segment display (a-g).
 */
const digitMap : { [key: string]: string[] } = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'g', 'e', 'd'],
    '3': ['a', 'b', 'g', 'c', 'd'],
    '4': ['f', 'g', 'b', 'c'],
    '5': ['a', 'f', 'g', 'c', 'd'],
    '6': ['a', 'f', 'g', 'e', 'c', 'd'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'c', 'd', 'f', 'g'],
    '-': ['g'], // Negative numbers, negative flags count
}

/**
 * Initializes a 7-segment digital display in the DOM.
 * @param container The HTML element that will hold the digits.
 * @param digitCount The total number of digits to render.
 * @returns An object with an `update` method to change the displayed value.
 */
export function createSevenSegmentDisplay(container: HTMLElement, digitCount: number) {
    container.innerHTML = '';
    const digits : HTMLElement[] = []

    // Generate DOM elements for each digit and its 7 segments
    for (let i=0; i < digitCount; i++) {
        const digitDiv = document.createElement('div');
        digitDiv.className = 'seven-segment';

        ['a','b','c','d','e','f','g'].forEach(s => {
            const seg = document.createElement('div');
            seg.className = `segment seg-${s}`;
            seg.dataset.seg = s;
            digitDiv.appendChild(seg);
        })

        container.appendChild(digitDiv);
        digits.push(digitDiv);
    }

    return {
        /**
         * Updates the display to show the provided number.
         * Handles negative numbers and pads with leading zeros.
         * @param value
         */
        update: (value: number) => {
            const isNegative = value < 0;
            const absValue = Math.abs(value).toString().padStart(isNegative ? digitCount -1 : digitCount, '0');
            const strValue = (isNegative ? '-' : '') + absValue;
            // Ensure we don't exceed the digit count
            const displayString = (strValue.slice(-digitCount));

            // Toggle the 'lit' class for segments based on the current character
            digits.forEach((digitDiv, idx) => {
                const char = displayString[idx];
                const segmentsToLight = digitMap[char] || [];

                const segments = digitDiv.querySelectorAll('.segment');
                segments.forEach(seg => {
                    const segLetter = (seg as HTMLElement).dataset.seg;
                    if (segLetter){
                        seg.classList.toggle('lit', segmentsToLight.includes(segLetter));
                    }
                })
            })
        }
    }
}