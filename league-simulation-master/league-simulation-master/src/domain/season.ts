import { Club } from './club/club';
import { MatchFixture } from './club/matchFixture';

export interface Season {
  id: number;
  seasonName: string;
  startDate: string;
  endDate: string;
  leagueName: string;
  matchFixtures: MatchFixture[];
  clubs: Club[];
}
