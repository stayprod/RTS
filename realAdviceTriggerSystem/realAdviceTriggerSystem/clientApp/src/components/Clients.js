import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import './clients.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Offices } from "./Offices";
import { ClientSettings } from "./ClientSettings";
import image from '../assets/images/profile_image.png'
import { useToken } from './tokenContext';
import { variables } from '../Variables';

export const Clients = (props) => {

    const [data, setData] = useState([]);
    const [settingObj, setSettingObj] = useState({});
    const [showAppended, setShowAppended] = useState(false);
    const [clientOffices, setClientOffices] = useState({});
    const [clientWarning, setClientWarning] = useState(0);
    const navigate = useNavigate();
    const token = useToken();

    const handleClick = (e) => {

        let id = "officeList" + e.target.getAttribute("clientid");

        document.querySelector("#" + id).classList.toggle("hidden");
        document.querySelector("#" + id).classList.contains("hidden") ?
            e.target.textContent = 'SEE OFFICES +' : e.target.textContent = 'SEE OFFICES -'
        setShowAppended(prevState => !prevState);
    };

    const showClientSettingsHandler = (e) => {
        let client = JSON.parse(e.target.getAttribute("clientdetail"));
        let url = "/clientsettings/" + client.id;

        navigate(url, {
            state: client
        })
    }

    useEffect(() => {
        if (token != null) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            };
            axios.post(variables.API_URL + `Client/GetAllClientsDetail?`, {}, config) // ASP.NET Core API endpoint with headers
                .then(async response => {
                    const clientsCollection = response.data;

                    axios.post('https://api.whise.eu/v1/admin/clients/list', {}, config) // ASP.NET Core API endpoint with headers
                        .then(async response => {
                            const clients = response.data.clients;
                            // Use Promise.all to make parallel API calls for settings
                            const settingsPromises = clients.map(async (client) => {
                                const settingsResponse = await axios.post(
                                    'https://api.whise.eu/v1/admin/clients/settings',
                                    { ClientId: client.id },
                                    config
                                );
                                var ffilter = clientsCollection.filter(d => {
                                    return d.client.whiseClientid == client.id
                                })
                                return { ...client, settings: settingsResponse.data.settings, localclient: ffilter[0] };
                            });

                            const clientDataWithSettings = await Promise.all(settingsPromises);

                            console.log(clientDataWithSettings);
                            setData(clientDataWithSettings);
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
                    <input type="text" className="form-control" placeholder="Search..." />
                    <Dropdown>
                        <Dropdown.Toggle className="btn-filter">
                            <FontAwesomeIcon icon={faFilter} className="ms-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="px-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="form-check-label" for="flexCheckDefault">
                                    Last created
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
                                <label class="form-check-label" for="flexCheckChecked">
                                    Last updated
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
                                <label class="form-check-label" for="flexCheckChecked">
                                    Sort by name
                                </label>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {
                data?.map((item, index) => (
                    <div className='clients-container' key={index}>
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
                                <span className="titleSpan fw-bold">STATUS:</span> {item.localclient != null && item.localclient.client.activationStatus != null ? item.localclient.client.activationStatus : "Pending"}
                                <br />
                                <div>
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                    <span className="titleSpan fw-bold">Warnings: </span>
                                    <span id={"client_" + item.id}></span>
                                    <br />
                                </div>
                                <button className='btn-site button top-right' clientdetail={JSON.stringify(item)} onClick={showClientSettingsHandler}>
                                    Settings
                                </button>
                                <button className="btn-site-expand expand-button" onClick={handleClick} clientid={item.id} key={index} id={`button-${index}`}>
                                    SEE OFFICES <span className={`expand-icon${index}`} id={`expand-button${index}`}>+</span>
                                </button>
                            </div>
                        </div>
                        <div className="hidden" id={"officeList" + item.id}>
                            <Offices clientId={item.id} client={item} />
                        </div>
                    </div>

                ))
            }
        </div>
    );
};

