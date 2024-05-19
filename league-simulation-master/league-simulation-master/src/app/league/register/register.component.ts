import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';  // Hibák megjelenítése

    constructor(private authService: AuthService, private router: Router) {}

    register(event: Event) {
        event.preventDefault();  // Megakadályozzuk az alapértelmezett form elküldést
        this.authService.register(this.email, this.password)
            .then(() => {
                console.log('Registration successful');
                this.router.navigate(['/home']);  // Átirányítás a főoldalra
            })
            .catch(error => {
                this.handleError(error);  // Hibakezelés
            });
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    handleError(error: any) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                this.errorMessage = 'This email is already in use.';
                break;
            case 'auth/invalid-email':
                this.errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                this.errorMessage = 'Password is too weak.';
                break;
            default:
                this.errorMessage = 'An error occurred. Please try again.';
        }
    }
}
