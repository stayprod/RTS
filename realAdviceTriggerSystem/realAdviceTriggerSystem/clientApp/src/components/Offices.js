import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients.css';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useToken } from './tokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';
//import image from './src/components/profile-image.PNG';


export const Offices = (props) => {
    const { clientId, client } = props;
    const [officesList, setOfficesList] = useState([]);
    const navigate = useNavigate();

    const officeSettingClickHandler = (e) => {
        let office = JSON.parse(e.target.getAttribute("officedetail"));

        const stateBuilder = {
            CurrentOffice: office,
            AllOffices: officesList,
            CurrentClient: client
        }

        const url = "/OfficeSettings/" + office.id;

        navigate(url, {
            state: stateBuilder
        })
    }
    const token = useToken();

    useEffect(() => {
        //const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlhdCI6MTY5MzI5MTY4OH0.eyJzZXJ2aWNlQ29uc3VtZXJJZCI6MTMzNywidHlwZUlkIjo0LCJjbGllbnRJZCI6MTAyNjN9.1-9mYean_qX58r6ykhP545Y3r8IGK53PgDOoyIja8YM';
        // Replace with your actual token

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        axios.post('https://api.whise.eu/v1/admin/offices/list', { "clientId": clientId }, config) // ASP.NET Core API endpoint with header
            .then(response => {
                let finalArrayToSet = [];
                response.data.offices.forEach(item => {
                    let existedOffInDb = client.localclient.office.filter(_off => {
                        return _off.whiseOfficeid == item.id
                    })
                    if (existedOffInDb.length > 0) {
                        item.warning = false;
                        let isAlreadyPushed = finalArrayToSet.includes(item, 0);
                        if (isAlreadyPushed == false) {
                            finalArrayToSet.push(item);
                        }
                    }
                    else {
                        item.warning = true;
                        let isAlreadyPushed = finalArrayToSet.includes(item, 0);
                        if (isAlreadyPushed == false) {
                            finalArrayToSet.push(item);
                        }
                    }
                })
                setOfficesList(finalArrayToSet);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="pt-4 px-5">
            {
                officesList.length > 0 ? officesList.map((item, i) => {
                    //let existedOffInDb = client.localclient.office.filter(_off => {
                    //    return _off.whiseOfficeid == item.id
                    //})
                    return (
                        <table className={i == officesList.length - 1 ? "table mb-0" : "table"} id='expandable-table'>
                            <tbody id='table-body'>
                                <tr>
                                    <td>
                                        <span className="tableTitleSpan fw-bold">Office Name:</span> {item.name}<br />
                                        <span className="tableTitleSpan fw-bold">Office ID: </span>{item.id}<br />
                                        <span className="tableTitleSpan fw-bold">Status:</span> {item.statusId}<br />
                                        {
                                            item.warning ?
                                                <span>
                                                    <FontAwesomeIcon icon={faExclamationTriangle} /><span>Warning!</span>
                                                </span>
                                                : ""
                                        }
                                    </td>
                                    <td>
                                        <button className="btn-site" onClick={officeSettingClickHandler} officedetail={JSON.stringify(item)}>Settings</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>)
                }) : ""
            }
        </div>
    );
};

