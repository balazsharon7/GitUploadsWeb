import { Component } from '@angular/core';
import { LeagueService } from '../../../service/leagueservice';
import { AuthService } from '../../../service/auth.service';  // AuthService importálása

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private leagueService: LeagueService, private authService: AuthService) {
    this.leagueService.createSeason(
        'Super League',
        '2024-2025',
        'May 2023',
        'Szeptember 2024'
    );
    console.log('Season created');
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch(error => {
      console.error('Error during logout', error);
    });
  }
}
