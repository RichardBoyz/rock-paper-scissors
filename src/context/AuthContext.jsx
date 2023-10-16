import { createContext, useContext } from "react";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  return <UserContext.Provider>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
  return useContext(UserContext);
};
