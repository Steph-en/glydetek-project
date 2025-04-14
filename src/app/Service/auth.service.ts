import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();
  public firebaseUser$: Observable<FirebaseUser | null> = user(this.auth);

  constructor() {
    this.firebaseUser$.subscribe((user) => {
      if (user) {
        this.isAuthenticatedSubject.next(true);
        this.loadUserProfile(user.uid);
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
      }
    });
  }

  async signup(userData: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
      const user = userCredential.user;
      if (user) {
        await this.saveUserProfile({
          uid: user.uid,
          username: userData.username,
          email: userData.email,
        });
      }
    } catch (error: any) {
      console.error('Signup failed:', error.message);
      throw error;
    }
  }

  async login(credentials: any): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
      // The auth state listener in the constructor will handle setting isAuthenticated and currentUser
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  private async saveUserProfile(userProfile: UserProfile): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userProfile.uid);
    try {
      await setDoc(userDocRef, userProfile);
      this.currentUserSubject.next(userProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  private async loadUserProfile(uid: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        this.currentUserSubject.next(docSnap.data() as UserProfile);
      } else {
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.currentUserSubject.next(null);
    }
  }
}