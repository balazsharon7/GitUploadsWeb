import { Observable, range } from 'rxjs';
import { map, toArray, switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { MatchFixture } from '../../../domain/club/matchFixture';
import { LeagueService } from '../../../service/leagueservice';

@Component({
  selector: 'app-league-fixtures',
  templateUrl: './league-fixtures.component.html',
  styleUrl: './league-fixtures.component.scss',
})
export class LeagueFixturesComponent {
  fixtures: MatchFixture[][] = [];

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.getMatchweeks(this.leagueService.matchFixtures$).subscribe(
      (matchweeks) => (this.fixtures = matchweeks)
    );
  }

  getMatchweeks(
    matchFixtures$: Observable<MatchFixture[]>
  ): Observable<MatchFixture[][]> {
    return matchFixtures$.pipe(
      switchMap((matchFixtures) => this.addMatchweeks(matchFixtures))
    );
  }

  addMatchweeks(
    matchFixtures: MatchFixture[]
  ): Observable<MatchFixture[][]> {
    const matchweekCount = matchFixtures.length / 3;
    return range(1, matchweekCount).pipe(
      map((matchweek) => this.getMatchweek(matchFixtures, matchweek)),
      toArray()
    );
  }

  getMatchweek(
    matchFixtures: MatchFixture[],
    matchweek: number
  ): MatchFixture[] {
    return matchFixtures.filter(
      (matchFixture) => matchFixture.matchweek === matchweek
    );
  }
}
