/**
 * Available difficulty levels for the game.
 */
export enum DifficultLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    EXPERT = 'EXPERT',
}

/**
 * Configuration parameters for a specific difficulty level.
 */
export interface DifficultSettings {
    rows: number,
    columns: number,
    bombCount: number
}

/**
 * Pre-defined configurations mapping each difficulty level to its grid size and bombs count.
 */
export const DifficultConfigs: Record<DifficultLevel, DifficultSettings> = {
    [DifficultLevel.BEGINNER]: {
        rows: 9,
        columns: 9,
        bombCount: 10,
    },
    [DifficultLevel.INTERMEDIATE]: {
        rows: 16,
        columns: 16,
        bombCount: 40,
    },
    [DifficultLevel.EXPERT]: {
        rows: 16,
        columns: 30,
        bombCount: 99,
    }
}