// tokenContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TokenContext = createContext();

export const useToken = () => {
    return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // You can add functions to set and clear the token here
    async function getToken() {
        let url = "https://api.whise.eu/token";
        let headers = {
            'Content-Type': 'application/json'
        };
        let body = {
            "Username": "dev@realadvice.be",
            "Password": "pa$$worD1"
        };

        try {
            let resp = await axios.post(url, body,
                {
                    headers: headers
                });
            if (resp && resp.data && resp.data.token) {
                setToken(resp.data.token);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async function fetchData() {
        try {
            await getToken();
            
        } catch (error) {
        }
    }

    fetchData();
        // Replace with your actual token


    return (
        <TokenContext.Provider value={token}>
            {children}
        </TokenContext.Provider>
    );
};
