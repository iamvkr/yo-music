import { createContext } from "react";
import userContext from "./UserContext";
import musicContext from "./MusicContext";

export const context = createContext();

const Context = ({ children }) => {
    const userData = userContext();
    const ytPlayer = musicContext();
    return (
        <context.Provider value={{
            ...userData,
            ...ytPlayer,
        }}>
            {children}
        </context.Provider>
    )
}

export default Context; //used at main.js