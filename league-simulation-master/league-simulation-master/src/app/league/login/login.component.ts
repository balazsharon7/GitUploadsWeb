import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  // Hibák megjelenítése

  constructor(private authService: AuthService, private router: Router) {}

  login(event: Event) {
    event.preventDefault();  // Megakadályozzuk az alapértelmezett form elküldést
    this.authService.login(this.email, this.password)
        .then(() => {
          console.log('Login successful');
          this.router.navigate(['/home']);  // Átirányítás a főoldalra
        })
        .catch(error => {
          this.handleError(error);  // Hibakezelés
        });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  handleError(error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Incorrect password.';
        break;
      default:
        this.errorMessage = 'An error occurred. Please try again.';
    }
  }
}
