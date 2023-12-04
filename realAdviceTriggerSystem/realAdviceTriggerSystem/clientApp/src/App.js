import React, { Component, Suspense, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import { AuthProvider } from './context/AuthContext';

import { Login } from "./components/Login";
import { Clients } from "./components/Clients";
import { Offices } from "./components/Offices";
import { ClientSettings } from "./components/ClientSettings";
import { OfficeSettings } from "./components/OfficeSettings";
import { Trigger } from "./components/Trigger";
import { Log } from './components/Log';

const App = () => {

    return (
        <Suspense>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Clients />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/clientsettings/:clientid" element={<ClientSettings />} />
                        <Route path="/officesettings/:whiseofficeid" element={<OfficeSettings />} />
                        <Route path="/trigger/:whiseofficeid" element={<Trigger />} />
                        <Route path="/log" element={<Log/> } />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Suspense>
    );
}

export default App;


//{
//    AppRoutes.map((route, index) => {
//        const { element, ...rest } = route;
//        return <Route key={index} {...rest} element={element} />;
//    })
//}