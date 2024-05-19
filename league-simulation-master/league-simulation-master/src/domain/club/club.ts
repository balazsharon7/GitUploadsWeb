import { ClubStats } from './clubStats';
import { MatchFixture } from './matchFixture';

export interface Club {
  id: number;
  clubName: string;
  clubShortName: string;
  leagueName: string;
  abbr: string;
  clubStats: ClubStats;
  fixtures?: {
    pastMatches: MatchFixture[];
    futureMatches: MatchFixture[];
    mostRecentMatch: MatchFixture;
    upcomingMatch: MatchFixture;
  };
}
