type VoteType = 'upvote' | 'downvote';
type SessionLevel = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
  id: number;
  workshopId: number;
  sequenceId: number;
  name: string;
  speaker: string;
  duration: number;
  level: SessionLevel;
  abstract: string;
  upvoteCount: number;
}

export type { VoteType, SessionLevel, ISession as default };
