import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  onAuthStateChanged,
  UserCredential
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserCredentials, AUTH_ERRORS } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Auth state observables
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    // Initialize auth state listener
    this.initAuthListener();
  }

  /**
   * Initialize Firebase auth state listener
   */
  private initAuthListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile
        const user = await this.getUserProfile(firebaseUser.uid);
        this.currentUserSubject.next(user);
      } else {
        // User is signed out
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: UserCredentials): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      // Update display name if provided
      if (credentials.displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: credentials.displayName
        });
      }

      // Create user profile in Firestore
      await this.createUserProfile(userCredential.user, 'email');

    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      await signInWithEmailAndPassword(this.auth, email, password);
      
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      await signOut(this.auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(this.firestore, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile(userCredential.user, 'google');
      }

    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      const provider = new OAuthProvider('apple.com');
      const userCredential = await signInWithPopup(this.auth, provider);

      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(this.firestore, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile(userCredential.user, 'apple');
      }

    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Create user profile in Firestore
   */
  private async createUserProfile(
    firebaseUser: FirebaseUser, 
    provider: 'email' | 'google' | 'apple'
  ): Promise<void> {
    const userRef = doc(this.firestore, 'users', firebaseUser.uid);
    
    const userData: Partial<User> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      provider: provider,
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(userRef, userData);
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  /**
   * Get current user (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this.currentUserSubject.value?.uid || null;
  }

  /**
   * Translate Firebase error codes to user-friendly messages
   */
  private getErrorMessage(code: string): string {
    return AUTH_ERRORS[code] || AUTH_ERRORS['default'];
  }
}
