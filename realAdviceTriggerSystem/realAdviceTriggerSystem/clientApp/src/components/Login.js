import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import './clients.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useToken } from './tokenContext';
import { variables, EnumobjClientStatus, validEmail } from '../Variables';
import image from '../assets/images/login_img.jpg';
import { UseAuthContext } from '../context/AuthContext';

export const Login = (props) => {

    const [userIP, setUserIP] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const navigate = useNavigate();
    const token = useToken();
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();


    const authenticateUser = async (e) => {
        let email = document.getElementById("userEmail");
        let pass = document.getElementById("userPassword");
        let isFieldEmpty = false;

        let user = {
            UserName: "",
            UserEmail: email.value,
            UserPassword: pass.value,
            UserIp: userIP,
            UserCountry: "",
            UserCity: "",
            UserState: "",
            UserStreet: ""
        }
        let errorMessage = [];

        if (user.UserEmail == "") {
            email.classList.add("empty");
            isFieldEmpty = true;
            setEmailMessage("Enter your email");
        }
        else if (user.UserEmail != "" && validEmail.test(user.UserEmail) == false) {
            email.classList.add("empty");
            isFieldEmpty = true;
            setEmailMessage("Enter a valid email");
        }

        if (user.UserPassword == "") {
            pass.classList.add("empty");
            isFieldEmpty = true;
            setPasswordMessage("Enter your password");
        }

        if (isFieldEmpty == true) {
            document.getElementById("errorMessage").innerHTML = "";
            errorMessage.forEach(e => {
                document.getElementById("errorMessage").innerHTML += e;
            })
            return;
        }

        let url = variables.API_URL + `User/AuthenticateUser?`;


        const jsonconfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        axios.post(url, JSON.stringify(user), jsonconfig) // ASP.NET Core API endpoint with header
            .then(response => {
                if (response.data.tokenValue != undefined) {
                    window.localStorage.setItem("authorized_user", JSON.stringify(response.data));
                    setIsLoggedIn(true);
                    setAuthUser(response.data)
                }
                else {
                    document.getElementById("errorMessage").innerHTML = "<div class='red'>" + response.data + "</div>";
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const resetErrorFieldStyle = (e) => {
        if (e.target.classList.contains("empty")) {
            e.target.classList.remove("empty");
        }

        if (e.target.id == "userEmail") {
            setEmailMessage("");
        }
        else {
            setPasswordMessage("");
        }
    }

    const getIp = async () => {
        const res = await axios.get("https://api.ipify.org/?format=json");
        setUserIP(res.data.ip);
    };

    useEffect(() => {
        //passing getData method to the lifecycle method
        getIp();
    }, []);

    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src={image}
                            className="img-fluid" alt="Sample image" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <h3 className="mb-4 pb-3">Hello! Welcome Back</h3>
                        <div className="text-danger" id="errorMessage"></div>
                        <div className="form-outline mb-4 position-relative">
                            <input type="email" id="userEmail" className="form-control"
                                placeholder="Enter a valid email address" onFocus={resetErrorFieldStyle} />
                            <small className="text-danger position-absolute fs-small">{emailMessage}</small>
                        </div>

                        <div className="form-outline mb-4 position-relative">
                            <input type="password" id="userPassword" className="form-control"
                                placeholder="Enter password" onFocus={resetErrorFieldStyle} />
                            <small className="text-danger position-absolute fs-small">{passwordMessage}</small>
                        </div>

                        {/*<div className="d-flex justify-content-between align-items-center">*/}
                        {/*    <div className="form-check mb-0">*/}
                        {/*        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />*/}
                        {/*        <label className="form-check-label" htmlFor="form2Example3">*/}
                        {/*            Remember me*/}
                        {/*        </label>*/}
                        {/*    </div>*/}
                        {/*    <a href="#!" className="text-body">Forgot password?</a>*/}
                        {/*</div>*/}

                        <div className="text-center text-lg-start mt-4 pt-2">
                            <button type="button" className="btn-site btn-login" onClick={authenticateUser} >Login</button>
                            {/*<p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!" className="link-danger">Register</a></p>*/}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

