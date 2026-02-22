// ─── Firebase Auth Helpers ────────────────────────────────────────────────────
// Wraps Firebase auth calls so components stay clean and easy to swap later.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { treeManager } from './mlmTree';
import type { UserData } from '../types';

export interface AuthResult {
  success: boolean;
  user?: UserData;
  error?: string;
}

export interface RegisterCustomerParams {
  name: string;
  email: string;
  password: string;
  contact: string;
  dateOfBirth: string;
  parentId?: string;
}

export interface RegisterBrandOwnerParams {
  name: string;
  email: string;
  password: string;
  contact: string;
  dateOfBirth: string;
  parentId?: string;
}

// ─── Register Customer ────────────────────────────────────────────────────────
export async function registerCustomer(params: RegisterCustomerParams): Promise<AuthResult> {
  const { name, email, password, contact, dateOfBirth, parentId } = params;

  try {
    // 1. Create Firebase user
    const credential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // 2. Register in MLM tree
    const result = treeManager.registerCustomer(
      name, email, password, contact, dateOfBirth, parentId
    );

    if (!result.success) {
      // Rollback Firebase user if tree registration fails
      await credential.user.delete();
      return { success: false, error: result.error ?? 'Tree registration failed' };
    }

    // 3. Persist user profile to Firestore
    await setDoc(doc(db, 'users', result.userId), {
      userId:    result.userId,
      name,
      email,
      contact,
      dateOfBirth,
      userType:  'customer',
      firebaseUid: credential.user.uid,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      user: {
        userId:   result.userId,
        name,
        email,
        userType: 'customer',
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return { success: false, error: friendlyFirebaseError(message) };
  }
}

// ─── Register Brand Owner ─────────────────────────────────────────────────────
export async function registerBrandOwner(params: RegisterBrandOwnerParams): Promise<AuthResult> {
  const { name, email, password, contact, dateOfBirth, parentId } = params;

  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    const result = treeManager.registerBrandOwner(
      name, email, password, contact, dateOfBirth, parentId
    );

    if (!result.success) {
      await credential.user.delete();
      return { success: false, error: result.error ?? 'Tree registration failed' };
    }

    await setDoc(doc(db, 'users', result.userId), {
      userId:    result.userId,
      name,
      email,
      contact,
      dateOfBirth,
      userType:  'brand_owner',
      firebaseUid: credential.user.uid,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      user: {
        userId:   result.userId,
        name,
        email,
        userType: 'brand_owner',
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return { success: false, error: friendlyFirebaseError(message) };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginUser(userId: string, password: string): Promise<AuthResult> {
  try {
    // 1. Look up user in tree to get their email
    const treeUser = treeManager.getUserById(userId);
    if (!treeUser) {
      return { success: false, error: 'Invalid User ID or Password' };
    }

    // 2. Sign in with Firebase using their email
    await signInWithEmailAndPassword(auth, treeUser.email, password);

    return {
      success: true,
      user: {
        userId:   treeUser.id,
        name:     treeUser.name,
        email:    treeUser.email,
        userType: treeUser.userType as UserData['userType'],
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return { success: false, error: friendlyFirebaseError(message) };
  }
}

// ─── Login via Portal (email + password) ─────────────────────────────────────
export async function loginPortalUser(email: string, password: string): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch Firestore profile to get userId and userType
    const snap = await getDoc(doc(db, 'users_by_firebase_uid', credential.user.uid));
    if (!snap.exists()) {
      // Fallback: look up by email in tree
      const treeUser = treeManager.getUserByEmail(email);
      if (!treeUser) return { success: false, error: 'User profile not found' };
      return {
        success: true,
        user: {
          userId:   treeUser.id,
          name:     treeUser.name,
          email:    treeUser.email,
          userType: treeUser.userType as UserData['userType'],
        },
      };
    }

    const data = snap.data();
    return {
      success: true,
      user: {
        userId:   data.userId,
        name:     data.name,
        email:    data.email,
        userType: data.userType,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return { success: false, error: friendlyFirebaseError(message) };
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send reset email';
    return { success: false, error: friendlyFirebaseError(message) };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ─── Friendly error messages ──────────────────────────────────────────────────
function friendlyFirebaseError(message: string): string {
  if (message.includes('email-already-in-use'))    return 'This email is already registered.';
  if (message.includes('invalid-email'))            return 'Invalid email address.';
  if (message.includes('weak-password'))            return 'Password must be at least 6 characters.';
  if (message.includes('user-not-found'))           return 'No account found with this email.';
  if (message.includes('wrong-password'))           return 'Invalid User ID or Password.';
  if (message.includes('too-many-requests'))        return 'Too many attempts. Please try again later.';
  if (message.includes('network-request-failed'))   return 'Network error. Check your connection.';
  return message;
}
