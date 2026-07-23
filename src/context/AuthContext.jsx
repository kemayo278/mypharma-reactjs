import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser : (() => {
        try {
            const user = localStorage.getItem("kgs-cust-widget-session");
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    })(),
    token: localStorage.getItem("access_token") || null
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state,dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    useEffect(()=>{
        localStorage.setItem("kgs-cust-widget-session", JSON.stringify(state.currentUser))
        localStorage.setItem("access_token", state.token);
    }, [state.currentUser, state.token]);
    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, token: state.token, dispatch }} >
            {children}
        </AuthContext.Provider>
    );
}