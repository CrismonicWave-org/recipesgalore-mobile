/**
 * User Model
 * Represents a RecipesGalore user
 */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  favorites?: string[];  // Array of recipe IDs
  provider?: 'email' | 'google' | 'apple';
}

/**
 * User credentials for sign up
 */
export interface UserCredentials {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Auth error messages
 */
export const AUTH_ERRORS: { [key: string]: string } = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email. Please sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/popup-closed-by-user': 'Sign-in cancelled.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
  'auth/credential-already-in-use': 'This credential is already associated with another account.',
  'auth/invalid-verification-code': 'Invalid verification code.',
  'auth/invalid-verification-id': 'Invalid verification ID.',
  'auth/missing-verification-code': 'Please enter the verification code.',
  'auth/missing-verification-id': 'Missing verification ID.',
  'default': 'An error occurred. Please try again.'
};
