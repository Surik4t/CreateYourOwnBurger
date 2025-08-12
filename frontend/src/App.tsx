import React, { useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import Home from './components/Home';

const AuthContext = React.createContext(null);
const TokenContext = React.createContext(null);


function App() {

    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState("");
    const readCookie = () => {
        let token = Cookies.get("token");
        if (token) {
            setAuth(true);
            setToken(token);
        }
    };
    React.useEffect(() => { readCookie() }, []);    

    return (
        <ChakraProvider value={defaultSystem}>
            <Routes>
            </Routes>
        </ChakraProvider>
    )
}

export default App;