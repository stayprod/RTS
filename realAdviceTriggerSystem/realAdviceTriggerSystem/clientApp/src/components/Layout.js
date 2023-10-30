import React, { Component } from 'react';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import { UseAuthContext } from '../context/AuthContext';

export const Layout = (props) => {
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    return (
        <div>
            {
                authUser == null ?
                    <></>
                    :
                    <NavMenu />
            }
            <div className="container">
                {props.children}
            </div>
        </div>
    );
}
