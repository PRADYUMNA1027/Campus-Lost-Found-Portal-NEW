import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    console.log("Google Login Successful");
    console.log("Name:", user.displayName);
    console.log("Email:", user.email);
    console.log("UID:", user.uid);

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Google Login Failed:", error);

    return {
      success: false,
      error
    };
  }
};

export const logoutFromFirebase = async () => {
  try {
    await signOut(auth);

    console.log("Firebase logout successful");

    return {
      success: true
    };
  } catch (error) {
    console.error("Firebase logout failed:", error);

    return {
      success: false,
      error
    };
  }
};