import './sevenSegments.css'

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
    '-': ['g'], // Negative numbers
}

export function createSevenSegmentDisplay(container: HTMLElement, digitCount: number) {
    container.innerHTML = '';
    const digits : HTMLElement[] = []

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
        update: (value: number) => {
            const isNegative = value < 0;
            const absValue = Math.abs(value).toString().padStart(isNegative ? digitCount -1 : digitCount, '0');
            const strValue = (isNegative ? '-' : '') + absValue;
            const displayString = (strValue.slice(-digitCount));

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