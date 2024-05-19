import { Component } from '@angular/core';
import { LeagueService } from '../../../service/leagueservice';

@Component({
  selector: 'app-league-actions',
  templateUrl: './league-actions.component.html',
  styleUrl: './league-actions.component.scss',
})
export class LeagueActionsComponent {
  isSeasonOver: boolean = false;
  percentage: number = 0;

  constructor(private leagueService: LeagueService) {}

  ngOnInit(): void {
    this.getMatchweek();
    this.calculatePercentage();
  }

  simulationWeek(): void {
    this.leagueService.simulateWeek();
  }

  simulationSeason(): void {
    this.leagueService.simulateSeason();
  }

  createNewSeason(): void {
    this.leagueService.createNewSeason();
  }

  calculatePercentage(): void {
    this.leagueService.matchWeek$.subscribe((week) => {
      let currentWeek: number = week;
      if (week < 11) currentWeek = week - 1;
      else currentWeek = 10;

      this.percentage = (currentWeek / 10) * 100;
    });
  }

  getMatchweek(): void {
    this.leagueService.matchWeek$.subscribe((week) => {
      if (week > 10) {
        this.isSeasonOver = true;
      } else {
        this.isSeasonOver = false;
      }
    });
  }
}
