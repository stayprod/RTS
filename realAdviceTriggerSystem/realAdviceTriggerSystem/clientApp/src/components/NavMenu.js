import React, { Component, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { UseAuthContext } from '../context/AuthContext';

export const NavMenu = (props) => {
    const [collapsed, setCollapsed] = useState(true);
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    const toggleNavbar = (e) => {
        setCollapsed(prevState => !prevState);
    }

    const logoutUser = (e) => {
        window.localStorage.removeItem('authorized_user');
        window.location.href = "/login";
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                <NavbarBrand tag={Link} to="/">Real Advice Trigger System</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/log">Log</NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/clients">Clients</NavLink>
                        </NavItem>
                        {
                            authUser != null ? 
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" onClick={logoutUser}>Logout</NavLink>
                                </NavItem>
                                :
                            <></>
                        }
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}
