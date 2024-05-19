import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private fireauth: AngularFireAuth, private router: Router) {}

    async register(email: string, password: string) {
        try {
            const result = await this.fireauth.createUserWithEmailAndPassword(email, password);
            console.log('User registered: ', result.user);
            return result;
        } catch (error: any) {
            console.error('Error during registration', error);
            throw error;  // Dobd tovább a hibát, hogy a komponens kezelhesse
        }
    }

    async login(email: string, password: string) {
        try {
            const result = await this.fireauth.signInWithEmailAndPassword(email, password);
            console.log('User logged in: ', result.user);
            return result;
        } catch (error: any) {
            console.error('Error during login', error);
            throw error;  // Dobd tovább a hibát, hogy a komponens kezelhesse
        }
    }

    async logout() {
        try {
            await this.fireauth.signOut();
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Error during logout', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.fireauth.authState;
    }
}
