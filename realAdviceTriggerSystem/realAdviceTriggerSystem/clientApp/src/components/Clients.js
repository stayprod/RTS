import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import './clients.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFilter, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Offices } from "./Offices";
import { ClientSettings } from "./ClientSettings";
import image from '../assets/images/profile_image.png'
import { useToken } from './tokenContext';
import { variables, EnumobjClientStatus } from '../Variables';
import { UseAuthContext } from '../context/AuthContext';

export const Clients = (props) => {
    const { isUserLoggedIn } = props;
    const [clientData, setClientData] = useState([]);
    const [settingObj, setSettingObj] = useState({});
    const [clientOffices, setClientOffices] = useState({});
    const [clientWarning, setClientWarning] = useState(0);
    const [whiseOfficesList, setWhiseOfficesList] = useState([]);
    const [clientIdsOfOffices, setClientIdsOfOffices] = useState([]);
    const [hiddenClass, setHiddenClass] = useState("hidden")
    const navigate = useNavigate();
    const token = useToken();
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    const handleClick = (e) => {

        let id = "officeList" + e.target.getAttribute("clientid");

        document.querySelector("#" + id).classList.toggle("hidden");
        document.querySelector("#" + id).classList.contains("hidden") ?
            e.target.textContent = 'See Offices +' : e.target.textContent = 'See Offices -'
    };

    const showClientSettingsHandler = (e) => {
        let client = JSON.parse(e.target.getAttribute("clientdetail"));
        let url = "/clientsettings/" + client.id;

        navigate(url, {
            state: client
        })
    }

    const handlerSearchClientOrOffice = (e) => {
        let inputValue = e.target.value;
        let clients = JSON.parse(window.localStorage.getItem('clientData'));

        if (inputValue == "") {
            setClientData(clients);
            setHiddenClass("hidden");
            document.querySelectorAll(".btn-site-expand").forEach(element => {
                element.textContent = "See Offices +";
            })
            return;
        }
        setHiddenClass("");

        let filteredClients = clients.filter(d => {
            let matchedOffices = d.clientWhiseOffices.filter(o => {
                return o.name.toLowerCase().includes(inputValue.toLowerCase()) || (o.id + "").toLowerCase().includes(inputValue.toLowerCase());
            })
            d.clientWhiseOffices = matchedOffices;
            if (matchedOffices.length > 0) {
                return d;
            }
            return d.name.toLowerCase().includes(inputValue.toLowerCase()) || (d.id + "").toLowerCase().includes(inputValue.toLowerCase());
        })

        setClientData(filteredClients);
        filteredClients.forEach(d => {
            document.getElementById("button-" + d.id).textContent = "See Offices -";
        })
    }

    const clearSearchBox = (e) => {
        document.getElementById("searchBox").value = "";
        let clients = JSON.parse(window.localStorage.getItem('clientData'));
        setClientData(clients);
        setHiddenClass("hidden");
        document.querySelectorAll(".btn-site-expand").forEach(element => {
            element.textContent = "See Offices +";
        })
    }
    useEffect(() => {
        if (token != null && authUser != null) {
            const jsonconfig = {
                headers: {
                    'Authorization': `Bearer ${authUser.tokenValue}`,
                    'Content-Type': 'application/json'
                }
            };
            axios.get(variables.API_URL + `Client/GetAllClientsDetail`, jsonconfig) // ASP.NET Core API endpoint with headers
                .then(async response => {
                    const clientsCollection = response.data;

                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    };

                    axios.post('https://api.whise.eu/v1/admin/clients/list', {}, config) // ASP.NET Core API endpoint with headers
                        .then(async response => {
                            const clients = response.data.clients;
                            // Use Promise.all to make parallel API calls for settings
                            const settingsPromises = clients.map(async (client) => {
                                let warningCount = 0;
                                const settingsResponse = await axios.post(
                                    'https://api.whise.eu/v1/admin/clients/settings',
                                    { ClientId: client.id },
                                    config
                                );

                                var ffilter = clientsCollection.filter(d => {
                                    return d.client.whiseClientid == client.id
                                })

                                const _whiseOffices = await axios.post('https://api.whise.eu/v1/admin/offices/list', { "clientId": client.id }, config) // ASP.NET Core API endpoint with header

                                let finalArrayToSet = [];
                                _whiseOffices.data.offices.forEach(item => {
                                    let existedTriggerInDb = ffilter[0]?.triggers.filter(_off => {
                                        return _off.whiseOfficeid == item.id
                                    })
                                    if (existedTriggerInDb && existedTriggerInDb.length > 0) {
                                        item.warning = false;
                                    }
                                    else {
                                        warningCount++;
                                        item.warning = true;
                                    }
                                    let isAlreadyPushed = finalArrayToSet.includes(item, 0);
                                    if (isAlreadyPushed == false) {
                                        finalArrayToSet.push(item);
                                    }
                                })
                                return { ...client, settings: settingsResponse.data.settings, localclient: ffilter[0], clientWhiseOffices: finalArrayToSet, warnings: warningCount };
                            });

                            const clientDataWithSettings = await Promise.all(settingsPromises);

                            console.log(clientDataWithSettings);
                            setClientData(clientDataWithSettings);
                            window.localStorage.setItem('clientData', JSON.stringify(clientDataWithSettings));
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [token]);

    return (
        <div>
            <div className="row py-3">
                <div className="col-sm-12">
                    <h4>Data from External API</h4>
                </div>
            </div>
            <div className="row pb-3">
                <div className="col-sm-12 col-md-4 d-flex align-items-center">
                    <div className="position-relative">
                        <input type="text" className="form-control" id="searchBox" placeholder="Search..." onChange={handlerSearchClientOrOffice} />
                        <FontAwesomeIcon icon={faCircleXmark} className={"position-absolute btn-search-cross " + hiddenClass} onClick={clearSearchBox} />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-filter">
                            <FontAwesomeIcon icon={faFilter} className="ms-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="px-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckLastCreated" />
                                <label class="form-check-label" for="flexCheckLastCreated">
                                    Last created
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckLastUpdated" />
                                <label class="form-check-label" for="flexCheckLastUpdated">
                                    Last updated
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckSort" />
                                <label class="form-check-label" for="flexCheckSort">
                                    Sort by name
                                </label>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {
                clientData?.map((item, index) => (
                    <div className='clients-container' clientname={item.name} clientid={item.id} key={index}>
                        <div className='profile-container'>
                            {
                                item.settings != undefined ?
                                    <img src={item.settings.logoUrl} alt="Profile_Image" className="profile-image" /> :
                                    <img src={image} alt="Profile_Image" className="profile-image" />
                            }
                            <div className='profile-details'>
                                <span className="titleSpan fw-bold">NAME:</span> {item.name}
                                <br />
                                <span className="titleSpan fw-bold">CRM CLIENT ID:</span> {item.id}
                                <br />
                                <span className="titleSpan fw-bold">STATUS:</span> {EnumobjClientStatus[item.localclient != null && item.localclient.client.activationStatus != null ? item.localclient.client.activationStatus : "1"]}
                                <br />
                                {
                                    item.warnings != undefined ? 
                                        <div>
                                            <FontAwesomeIcon icon={faExclamationTriangle} />
                                            <span className="titleSpan fw-bold">Warnings: {item.warnings}</span>
                                            <span id={"client_" + item.id}></span>
                                            <br />
                                        </div>
                                        :
                                        <></>
                                }
                                <button className='btn-site button top-right' clientdetail={JSON.stringify(item)} onClick={showClientSettingsHandler}>
                                    Settings
                                </button>
                                <button className="btn-site-expand expand-button" onClick={handleClick} clientid={item.id} key={index} id={`button-${item.id}`}>
                                    See Offices +
                                </button>
                            </div>
                        </div>
                        <div className={"offices " + hiddenClass} id={"officeList" + item.id}>
                            <Offices clientId={item.id} client={item} whiseOfficesList={item.clientWhiseOffices} />
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

