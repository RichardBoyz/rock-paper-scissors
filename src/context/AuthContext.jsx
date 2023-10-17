import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { collection, addDoc } from "@firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const updateUserDisplayName = (authInstence, displayName) => {
    return updateProfile(authInstence.currentUser, {
      displayName: displayName,
    });
  };

  const createUserInDatabase = async (currentUser) => {
    const { uid, displayName, email } = currentUser;

    const docRef = await addDoc(collection(db, "users"), {
      uid,
      displayName,
      email,
    });
    console.log("Create user succeed.");
  };

  const createUser = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateUserDisplayName(userCredential.user.auth, displayName);
    console.log(userCredential);
    await createUserInDatabase(userCredential.user.auth.currentUser);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
