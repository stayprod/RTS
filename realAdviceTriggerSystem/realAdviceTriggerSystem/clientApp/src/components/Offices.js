import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients.css';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useToken } from './tokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';
//import image from './src/components/profile-image.PNG';


export const Offices = (props) => {
    const { clientId, client, whiseOfficesList } = props;
    const [whiseOffices, setWhiseOffices] = useState([]);
    const navigate = useNavigate();



    const officeSettingClickHandler = (e) => {
        let _whiseOffice = JSON.parse(e.target.getAttribute("officedetail"));

        const localOffices = client.localclient?.office;

        const stateBuilder = {
            WhiseOffice: _whiseOffice,
            AllWhiseOffices: whiseOfficesList,
            CurrentClient: client
        }

        if (localOffices != undefined) {
            //filtering out locally saved office 
            const l_office = localOffices?.filter(item => {
                return item.whiseOfficeid == _whiseOffice.id
            })
            stateBuilder.LocalOffice = l_office[0];
            stateBuilder.LocalOfficesList = localOffices;
        }

        const url = "/officesettings/" + _whiseOffice.id;

        navigate(url, {
            state: stateBuilder
        })
    }
    const token = useToken();
    let warningCount = 0;

    //useEffect(() => {
    //    //const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlhdCI6MTY5MzI5MTY4OH0.eyJzZXJ2aWNlQ29uc3VtZXJJZCI6MTMzNywidHlwZUlkIjo0LCJjbGllbnRJZCI6MTAyNjN9.1-9mYean_qX58r6ykhP545Y3r8IGK53PgDOoyIja8YM';
    //    // Replace with your actual token

    //    const config = {
    //        headers: {
    //            'Authorization': `Bearer ${token}`,
    //            'Content-Type': 'application/json'
    //        },
    //    };
    //    axios.post('https://api.whise.eu/v1/admin/offices/list', { "clientId": clientId }, config) // ASP.NET Core API endpoint with header
    //        .then(response => {
    //            let finalArrayToSet = [];
    //            response.data.offices.forEach(item => {
    //                let existedTriggerInDb = client.localclient?.triggers.filter(_off => {
    //                    return _off.whiseOfficeid == item.id
    //                })
    //                if (existedTriggerInDb && existedTriggerInDb.length > 0) {
    //                    item.warning = false;
    //                }
    //                else {
    //                    warningCount++;
    //                    item.warning = true;
    //                }
    //                let isAlreadyPushed = finalArrayToSet.includes(item, 0);
    //                if (isAlreadyPushed == false) {
    //                    finalArrayToSet.push(item);
    //                }
    //            })
    //            setWhiseOfficesList(finalArrayToSet);
    //            window.localStorage.setItem("whiseOffices", JSON.stringify(finalArrayToSet));
    //            if (warningCount == 0) {
    //                document.getElementById("client_" + clientId).parentElement.classList.add("d-none");
    //            }
    //            else {
    //                document.getElementById("client_" + clientId).parentElement.classList.remove("d-none");
    //                document.getElementById("client_" + clientId).innerHTML = warningCount;
    //            }
    //        })
    //        .catch(error => {
    //            console.error('Error fetching data:', error);
    //        });

    //}, [searchedValue]);

    //useEffect(() => {
    //    if (whiseOfficesList != null && clientId) {
    //        let finalArrayToSet = [];
    //        whiseOfficesList.forEach(item => {
    //            let existedTriggerInDb = client.localclient?.triggers.filter(_off => {
    //                return _off.whiseOfficeid == item.id
    //            })
    //            if (existedTriggerInDb && existedTriggerInDb.length > 0) {
    //                item.warning = false;
    //            }
    //            else {
    //                warningCount++;
    //                item.warning = true;
    //            }
    //            let isAlreadyPushed = finalArrayToSet.includes(item, 0);
    //            if (isAlreadyPushed == false) {
    //                finalArrayToSet.push(item);
    //            }
    //        })
    //        setWhiseOffices(finalArrayToSet);
    //        if (warningCount == 0) {
    //            document.getElementById("client_" + clientId).parentElement.classList.add("d-none");
    //        }
    //        else {
    //            document.getElementById("client_" + clientId).parentElement.classList.remove("d-none");
    //            document.getElementById("client_" + clientId).innerHTML = warningCount;
    //        }
    //    }
    //}, [])

    return (
        <div className="pt-4 px-5">
            {
                whiseOfficesList.length > 0 ? whiseOfficesList.map((item, i) => {
                    return (
                        <table className={i == whiseOfficesList.length - 1 ? "table mb-0" : "table"} id='expandable-table' key={item.id}>
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

