export enum DifficultLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    EXPERT = 'EXPERT',
}

export interface DifficultSettings {
    rows: number,
    columns: number,
    bombCount: number
}

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
        rows: 30,
        columns: 16,
        bombCount: 99,
    }
}