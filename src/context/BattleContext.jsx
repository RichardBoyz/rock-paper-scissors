import { createContext, useContext } from "react";

const BattleContext = createContext();

const BattleProvider = ({ children }) => {
  return <BattleContext.Provider>{children}</BattleContext.Provider>;
};

const BattleField = useContext(BattleContext);
