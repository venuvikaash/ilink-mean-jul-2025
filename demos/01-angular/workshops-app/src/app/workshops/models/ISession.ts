type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
    id: number;
    workshopId: number;
    sequenceId: number;
    name: string;
    speaker: string;
    duration: number;
    level: Level;
    abstract: string;
    upvoteCount: number;
}

export type {
    Level,
    ISession as default
};