import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "../firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const updateUserDisplayName = (authInstence, displayName) => {
    return updateProfile(authInstence.currentUser, {
      displayName: displayName,
    });
  };

  const createUser = async (email, password, displayName) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        updateUserDisplayName(userCredential.user.auth, displayName);
      }
    );
  };

  return (
    <UserContext.Provider value={{ createUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
