﻿import React, { Component, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import { UseAuthContext } from '../context/AuthContext';

import { variables } from '../Variables';
import { useToken } from './tokenContext';
import image from '../assets/images/profile_image.png'

export const ClientSettings = (props) => {
    const [clientDetail, setClientDetail] = useState({});
    const [whiseOffices, setWhiseOffices] = useState({});
    const [clientDetailFromDB, setClientDetailFromDB] = useState({});
    const [adminDetail, setAdminDetail] = useState({});

    const token = useToken();
    const { clientid } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    let _client = {
        "clientid": 0,
        "whiseClientid": 0,
        "activationStatus": "",
        "logo": "",
        "commercialName": "",
        "street": "",
        "north": "",
        "boxNumber": "",
        "zipCode": "",
        "city": "",
        "email": "",
        "phoneNumber": "",
        "website": "",
        "country": "",
        "crmDetail": "",
        "comments": ""
    }

    let _admin = {
        adminid: 0,
        clientid: 0,
        legalName: "",
        vatNumber: "",
        bankName: "",
        accountNumber: "",
        bic: "",
        iban: ""
    }

    const officeSettingClickHandler = (e) => {
        let _whiseOffice = JSON.parse(e.target.getAttribute("officedetail"));

        const localOffices = clientDetail.localclient?.office;

        const stateBuilder = {
            WhiseOffice: _whiseOffice,
            AllWhiseOffices: whiseOffices,
            CurrentClient: clientDetail
        }

        if (localOffices != undefined) {
            //filtering out locally saved office 
            const l_office = localOffices?.filter(item => {
                return item.whiseOfficeid == _whiseOffice.id
            })
            stateBuilder.LocalOffice = l_office[0];
            stateBuilder.LocalOfficesList = localOffices;
        }

        const url = "/OfficeSettings/" + _whiseOffice.id;

        navigate(url, {
            state: stateBuilder
        })
    }

    const setStateBuilders = () => {
        if (location.state != null) {
            setClientDetail(location.state);
            if (location.state.localclient != undefined) {
                setClientDetailFromDB(location.state.localclient.client);
            }
            getClientDetail(location.state.id);
        }
    }

    const getClientDetail = async (clientId) => {
        //const response = await fetch(variables.API_URL + 'Client/GetClientDetail?clientId=' + location.state.id);
        //const jsonData = await response.json();
        //if (jsonData != null) {
        //    setClientDetailFromDB(jsonData);

        //    const adminResponse = await fetch(variables.API_URL + 'Admin/GetAdminDetail?clientId=' + jsonData.clientid);
        //    const adminJsonData = await adminResponse.json();
        //    if (adminJsonData != null) {
        //        setAdminDetail(adminJsonData);
        //    }
        //}
    }

    const readStateElements = () => {
        if (location.state.localclient != undefined) {
            setClientDetailFromDB(location.state.localclient.client)
            setAdminDetail(location.state.localclient.admin[0]);
            document.getElementById("status").value = location.state.localclient.client.activationStatus;
            document.getElementById("crmName").value = location.state.localclient.client.crmDetail;
            document.getElementById("country").value = location.state.localclient.client.country;
        }
    }

    const getOfficesList = () => {
        if (location.state != null && token != null) {
            readStateElements();

            //get client offices and pass to setting screen
            // Replace with your actual token
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            };
            axios.post('https://api.whise.eu/v1/admin/offices/list', { "clientId": location.state.id }, config) // ASP.NET Core API endpoint with header
                .then(response => {
                    setWhiseOffices(response.data.offices);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

    }

    const saveClientDetail = async (e) => {
        e.target.setAttribute("disabled", true);
        document.querySelector("body").style.cursor = "progress";
        _client.clientid = clientDetailFromDB.clientid != undefined ? clientDetailFromDB.clientid : 0;
        _client.whiseClientid = clientDetail.id
        _client.commercialName = document.getElementById("commercialName").value;
        _client.activationStatus = document.getElementById("status").value;
        _client.street = document.getElementById("street").value;
        _client.north = document.getElementById("north").value;
        _client.boxNumber = document.getElementById("box").value;
        _client.zipCode = document.getElementById("zipcode").value;
        _client.city = document.getElementById("city").value;
        _client.country = document.getElementById("country").value;
        _client.email = document.getElementById("email").value;
        _client.phoneNumber = document.getElementById("phoneNumber").value;
        _client.website = document.getElementById("website").value;
        _client.crmDetail = document.getElementById("crmName").value;
        _client.comments = document.getElementById("comments").value;


        let url = variables.API_URL + `Client/SaveClientDetail?`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_client)
        });
        const jsonData = await response.json();

        let clientId = jsonData.clientid;

        if (clientId > 0) {
            if (location.state.localclient == undefined) {
                location.state.localclient = { client: jsonData };
                setClientDetail(location.state);
                setClientDetailFromDB(location.state.localclient.client)
            }

            _admin.adminid = adminDetail.adminid == 0 ? 0 : adminDetail.adminid;
            _admin.clientid = clientId;
            _admin.legalName = document.getElementById("legalName").value;
            _admin.vatNumber = document.getElementById("vatNumber").value;
            _admin.bankName = document.getElementById("bankName").value;
            _admin.accountNumber = document.getElementById("accountNumber").value;
            _admin.bic = document.getElementById("bic").value;
            _admin.iban = document.getElementById("ibanNumber").value;

            let adminUrl = variables.API_URL + `Admin/SaveAdminDetail?`;
            const adminResponse = await fetch(adminUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authUser.tokenValue}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_admin)
            });
            const adminJsonData = await adminResponse.json();

            if (adminJsonData.adminid > 0) {
                alert("Client settings successfully saved.");
                e.target.removeAttribute("disabled");
                document.querySelector("body").style.cursor = "default";
                updateClientStateuOnClientSaving(jsonData, adminJsonData);
            }
        }

    }

    const updateClientStateuOnClientSaving = (clientData, adminData) => {
        var client = clientDetail;
        if (client.localclient != undefined) {
            client.localclient.client = clientData;
            if (client.localclient.admin != undefined) {
                client.localclient.admin[0] = adminData;
            }
            else {
                client.localclient.admin = [];
                client.localclient.admin.push(adminData)
            }
        }

        let url = "/clientsettings/" + client.id;
        navigate(url, {
            state: client
        })
    }

    useEffect(() => {
        document.title = 'Client Settings - Real Advice Trigger System';
        setStateBuilders();
    }, [])

    useEffect(() => {
        getOfficesList();
    }, [token])

    return (
        <section className="client-setting">
            <div className="row py-3">
                <div className="col-sm-6">
                    <h4>Client Details</h4>
                </div>
            </div>
            <div className="pb-4 pt-2">
                {
                    whiseOffices.length > 0 ? whiseOffices.map(item => {
                        return (
                            <button className="name-tiles" onClick={officeSettingClickHandler} officedetail={JSON.stringify(item)}>{
                                item.name
                            }</button>
                        )
                    })
                        :
                        <></>
                }
            </div>
            <div className="card">
                <div className="row">
                    <div className="col-sm-12 col-md-2 text-md-center text-sm-start mb-sm-3">

                        {
                            clientDetail.settings != undefined ?
                                <img src={clientDetail.settings.logoUrl} alt="Profile_Image" className="profile-image" /> :
                                <img src={image} alt="Profile_Image" className="profile-image" />
                        }
                    </div>
                    <div className="col-sm-12 col-md-6 mb-sm-3">
                        <label className="me-1">Whise Commercial Name:</label>
                        <strong>{clientDetail.name}</strong><br />
                        <label className="me-1">Whise Client Id:</label>
                        <strong>{clientDetail.id}</strong>
                    </div>
                    <div className="col-sm-12 col-md-4 mb-0">
                        <label>Status</label>
                        <select className="form-select" id="status">
                            <option value="1">Pending</option>
                            <option value="2">Demo</option>
                            <option value="3">Activate</option>
                            <option value="4">Suspended</option>
                            <option value="5">Deactivate</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="card">
                <div>
                    <h6 className="sub-heading fw-bold mb-3">General Details:</h6>
                </div>
                <div className="row">
                    <div className="col-sm-4 mb-3">
                        <label>Commercial Name</label>
                        <input type="text" className="form-control" id="commercialName" defaultValue={clientDetailFromDB.commercialName} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>Street</label>
                        <input type="text" className="form-control" id="street" defaultValue={clientDetailFromDB.street != undefined ? clientDetailFromDB.street : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>N</label>
                        <input type="text" className="form-control" id="north" defaultValue={clientDetailFromDB.north != undefined ? clientDetailFromDB.north : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>Box</label>
                        <input type="text" className="form-control" id="box" defaultValue={clientDetailFromDB.boxNumber != undefined ? clientDetailFromDB.boxNumber : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>Zip Code</label>
                        <input type="text" className="form-control" id="zipcode" defaultValue={clientDetailFromDB.zipCode != undefined ? clientDetailFromDB.zipCode : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>City</label>
                        <input type="text" className="form-control" id="city" defaultValue={clientDetailFromDB.city != undefined ? clientDetailFromDB.city : ""} />
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label>Country List</label>
                        <select className="form-select" id="country">
                            <option value="">Select an option</option>
                            <option value="1">German</option>
                            <option value="2">United States</option>
                            <option value="3">Russia</option>
                            <option value="4">France</option>
                        </select>
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label>Email</label>
                        <input type="text" className="form-control" id="email" defaultValue={clientDetailFromDB.email != undefined ? clientDetailFromDB.email : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>Phone Number</label>
                        <input type="text" className="form-control" id="phoneNumber" defaultValue={clientDetailFromDB.phoneNumber != undefined ? clientDetailFromDB.phoneNumber : ""} />
                    </div>
                    <div className="col-sm-4">
                        <label>Website</label>
                        <input type="text" className="form-control" id="website" defaultValue={clientDetailFromDB.website != undefined ? clientDetailFromDB.website : clientDetail.url} />
                    </div>
                </div>
            </div>
            <div className="card">
                <div>
                    <h6 className="sub-heading fw-bold mb-3">Admin Details:</h6>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb-3">
                        <label>Legal Name</label>
                        <input type="text" className="form-control" id="legalName" defaultValue={adminDetail.legalName != undefined ? adminDetail.legalName : ""} />
                    </div>
                    <div className="col-sm-2 mb-3">
                        <label>VAT Number</label>
                        <input type="text" className="form-control" id="vatNumber" defaultValue={adminDetail.vatNumber != undefined ? adminDetail.vatNumber : ""} />
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label>Bank Name</label>
                        <input type="text" className="form-control" id="bankName" defaultValue={adminDetail.bankName != undefined ? adminDetail.bankName : ""} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Account Number</label>
                        <input type="text" className="form-control" id="accountNumber" defaultValue={adminDetail.accountNumber != undefined ? adminDetail.accountNumber : ""} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>BIC</label>
                        <input type="text" className="form-control" id="bic" defaultValue={adminDetail.bic != undefined ? adminDetail.bic : ""} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>IBAN Number</label>
                        <input type="text" className="form-control" id="ibanNumber" defaultValue={adminDetail.iban != undefined ? adminDetail.iban : ""} />
                    </div>
                </div>
            </div>
            <div className="card">
                <div>
                    <h6 className="sub-heading fw-bold mb-3">CRM Details:</h6>
                </div>
                <div className="row">
                    <div className="col-sm-4 mb-3">
                        <label>CRM Name</label>
                        <select className="form-select" id="crmName">
                            <option value="">Select an option</option>
                            <option value="Whise">Whise</option>
                            <option value="Omnicasa">Omnicasa</option>
                            <option value="Sweepbright">Sweepbright</option>
                            <option value="Zabun">Zabun</option>
                            <option value="Apimo">Apimo</option>
                            <option value="Activimmo">Activimmo</option>
                        </select>
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Client ID</label>
                        <div className="form-control field-disabled">{clientDetail.id}</div>
                    </div>
                    <div className="col-sm-4">
                    </div>
                    <div className="col-sm-12 mb-3 mb-md-0">
                        <label>Internal Comments</label>
                        <textarea className="form-control" rows="4" id="comments" defaultValue={clientDetailFromDB.comments != undefined ? clientDetailFromDB.comments : ""}></textarea>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <button className="btn-site" onClick={saveClientDetail}>Save</button>
            </div>
        </section>
    );
}