import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration details go here
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Authentication service
const auth = firebase.auth();

// Function to handle email and password login
export const loginWithEmailPassword = async (email, password) => {
  try {
    // Sign in the user with email and password
    const userCredential = await auth.signInWithEmailAndPassword(email, password);

    // Get the authenticated user
    const user = userCredential.user;

    // Return the authenticated user
    return user;
  } catch (error) {
    // Handle login errors
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to handle user registration with email and password
export const registerWithEmailPassword = async (email, password) => {
  try {
    // Create a new user with email and password
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);

    // Get the newly created user
    const user = userCredential.user;

    // Return the new user
    return user;
  } catch (error) {
    // Handle registration errors
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to handle user sign out
export const signOut = async () => {
  try {
    // Sign out the current user
    await auth.signOut();
  } catch (error) {
    // Handle sign out errors
    console.error('Error signing out:', error);
    throw error;
  }
};