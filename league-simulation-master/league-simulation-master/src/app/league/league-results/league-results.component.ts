import { Component } from '@angular/core';
import { LeagueService } from '../../../service/leagueservice';
import { MatchFixture } from '../../../domain/club/matchFixture';

@Component({
  selector: 'app-league-results',
  templateUrl: './league-results.component.html',
  styleUrl: './league-results.component.scss',
})
export class LeagueResultsComponent {
  week: number = 1;
  lastWeekFixture: MatchFixture[] = [];
  currentWeekFixture: MatchFixture[] = [];
  nextWeekFixture: MatchFixture[] = [];

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.getMatchweek();
    this.updateWeekFixture();
  }

  updateWeekFixture(): void {
    this.leagueService.matchFixtures$.subscribe((matchFixtures) => {
      this.lastWeekFixture = matchFixtures.filter(
        (matchFixture) => matchFixture.matchweek === this.week - 1
      );
      this.currentWeekFixture = matchFixtures.filter(
        (matchFixture) => matchFixture.matchweek === this.week
      );
      this.nextWeekFixture = matchFixtures.filter(
        (matchFixture) => matchFixture.matchweek === this.week + 1
      );
    });
  }

  getMatchweek(): void {
    this.leagueService.matchWeek$.subscribe((week) => {
      this.week = week;
      this.updateWeekFixture();
    });
  }
}
