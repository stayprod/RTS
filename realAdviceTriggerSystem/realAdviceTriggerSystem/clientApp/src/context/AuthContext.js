import React, { useState, useEffect, useContext, createContext } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import moment from 'moment';

const AuthContext = createContext();

export function UseAuthContext() {

    return useContext(AuthContext);
}

export function AuthProvider(props) {
    const [authUser, setAuthUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    }

    useEffect(() => {
        const loggedInUser = window.localStorage.getItem('authorized_user');
        if (loggedInUser != 'null' && loggedInUser != null) {
            const foundUser = JSON.parse(loggedInUser);
            var currentDate = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
            var tokenExpiryDate = moment(foundUser.expiryDateTime).format('MMMM Do YYYY, h:mm:ss a');
            if (currentDate < tokenExpiryDate) {
                setAuthUser(foundUser);
                setIsLoggedIn(true);
            }
            else {
                window.localStorage.removeItem('authorized_user');
                navigate("/login");
            }
        }
        else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (authUser == null) {
            return;
        }
        if (authUser != null && location.pathname.indexOf("login") > 0 ) {
            localStorage.setItem("token", JSON.stringify(authUser)); // so you get it later
            navigate("/");
        }
        //else {
        //    navigate("/login");
        //}
    }, [authUser]);

    return (
        <AuthContext.Provider value={value}>
            {
                props.children
            }
        </AuthContext.Provider>
    )
}