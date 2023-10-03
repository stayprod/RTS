import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import "draftail/dist/draftail.css";
import { convertToRaw, convertFromRaw } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE, UNDO_ICON } from "draftail";
import { useToken } from './tokenContext';
import { variables } from '../Variables';

import { Trigger } from './Trigger';

export const OfficeSettings = (props) => {
    const token = useToken();
    const [offices, setOffices] = useState({});
    const [whiseOffice, setWhiseOffice] = useState({});
    const [localOffice, setLocalOffice] = useState({});
    const [currentClient, setCurrentClient] = useState({});
    const [triggers, setTriggers] = useState({});
    const [showTriggerScreen, setShowTriggerScreen] = useState(false);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [pimcoreSettingsHtml, setPimcoreSettingsHtml] = useState("");
    const [pimcoreSettingsRows, setPimcoreSettingsRows] = useState(0);
    const [pimcoreSettings, setPimcoreSettings] = useState({});

    let linkBuilder = "";

    const location = useLocation();
    const navigate = useNavigate();
    const optionElements = [];

    const getListOfOfficesFromStateBuilder = () => {
        //list of whise offices for a specific client
        setOffices(location.state.AllWhiseOffices);

        //selected office detail from whise
        setWhiseOffice(location.state.WhiseOffice);

        //client object including whise client detail and local database client detail
        setCurrentClient(location.state.CurrentClient);

        setLocalOffice(location.state.LocalOffice);
        getTriggersByOffice(location.state.LocalOffice);
        getPimcoreSettingsByOffice(location.state.WhiseOffice);
    }

    const getTriggersByOffice = async (_office) => {
        if (_office == undefined) {
            return
        }
        const response = await fetch(variables.API_URL + 'OfficeTrigger/GetAllTriggersByOffice?officeId=' + _office.officeid);
        const jsonData = await response.json();
        if (jsonData != null) {
            setTriggers(jsonData);
        }
    }

    const getPimcoreSettingsByOffice = async (_office) => {
        if (_office == undefined) {
            return
        }
        const response = await fetch(variables.API_URL + 'PimcoreSettings/GetPimcoreDetail?whiseOfficeId=' + _office.id);
        const jsonData = await response.json();
        if (jsonData != null && jsonData.length > 0) {
            setPimcoreSettings(jsonData);
            jsonData.forEach((item, i) => {
                let newRowhtml = `<div class="row position-relative" id="row${i}"><div class="col-sm-4 mb-3 mb-md-3">
                        <label>First Name</label>
                        <input type="text" class="form-control" id="pimcoreFName${i}" value="${item.firstName}" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Last Name</label>
                        <input type="text" class="form-control" id="pimcoreLName${i}" value="${item.lastName}" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Login Id</label>
                        <input type="text" class="form-control" id="pimcoreLoginID${i}" value="${item.loginId}" />
                    </div>
                    <span class="remove-setting-icon" onclick="removePimcoreSettingsRow" parentid="row${i}">
                        <svg title="delete row" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                    </span>
                    </div>`;
                setPimcoreSettingsHtml(prevState => prevState + newRowhtml);
            })
            setPimcoreSettingsRows(jsonData.length);
        }
        else {
            let newRowhtml = `<div class="row position-relative" id="row0"><div class="col-sm-4 mb-3 mb-md-3">
                        <label>First Name</label>
                        <input type="text" class="form-control" id="pimcoreFName0" value="" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Last Name</label>
                        <input type="text" class="form-control" id="pimcoreLName0" value="" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Login Id</label>
                        <input type="text" class="form-control" id="pimcoreLoginID0" value="" />
                    </div>
                    <span class="remove-setting-icon" onclick="removePimcoreSettingsRow" parentid="row0">
                        <svg title="delete row" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                    </span>
                    </div>`;
            setPimcoreSettingsHtml(prevState => prevState + newRowhtml);
            setPimcoreSettingsRows(1);
        }
    }

    const addNewPimcoreSettingsRow = (e) => {
        if (pimcoreSettingsRows == 4) {
            alert("Maximum four agents are allowed");
            return
        }
        setPimcoreSettingsRows(prevState => prevState + 1);
        let newRowhtml = `<div class="row position-relative" id="row${pimcoreSettingsRows}"><div class="col-sm-4 mb-3 mb-md-3">
                        <label>First Name</label>
                        <input type="text" class="form-control" id="pimcoreFName${pimcoreSettingsRows}" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Last Name</label>
                        <input type="text" class="form-control" id="pimcoreLName${pimcoreSettingsRows}" />
                    </div>
                    <div class="col-sm-4 mb-3 mb-md-3">
                        <label>Login Id</label>
                        <input type="text" class="form-control" id="pimcoreLoginID${pimcoreSettingsRows}" />
                    </div>
                    <span class="remove-setting-icon" onclick="removePimcoreSettingsRow" parentid="row${pimcoreSettingsRows}">
                        <svg title="delete row" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                    </span>
                    </div>`;
        setPimcoreSettingsHtml(prevState => prevState + newRowhtml);
    }

    const removePimcoreSettingsRow = (e) => {
        const rowsCount = pimcoreSettingsRows - 1;
        const parentId = e.target.getAttribute("parentid");
        document.getElementById(parentId).remove();
        setPimcoreSettingsRows(rowsCount);
    }

    const officeSettingClickHandler = (e) => {
        let office = JSON.parse(e.target.getAttribute("officedetail"));

        const stateBuilder = {
            WhiseOffice: office,
            AllWhiseOffices: offices,
            CurrentClient: currentClient
        }

        const url = "/OfficeSettings/" + office.id;

        var currentPath = window.location.pathname;

        navigate(url, {
            state: stateBuilder
        })

        if (currentPath.includes("/OfficeSettings")) {
            window.location.reload();
        }

    }

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        const filename = e.target.files[0].name;
        const extension = filename.split(".")[1];
        const finalName = whiseOffice.name.replace(/ /g, "") + "." + extension;
        setFileName(finalName);
    }

    const uploadImage = () => {

        //configurations to post formdata
        const formConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        //ImageUpload api call
        //Upload office image and get image path
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        let fileuploadurl = window.location.origin + `/api/File/UploadLogo?`;

        return axios.post(fileuploadurl, formData, formConfig)
            .then((response) => {
                response.data
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });

    }

    const showTriggerForm = (_office) => {
        const stateBuilder = {
            LocalOfficeDetail: _office,
            WhiseOffice: whiseOffice,
            ClientDetail: currentClient,
            AllWhiseOffices: offices
        }

        const url = "/trigger/" + _office.officeid;
        navigate(url, {
            state: stateBuilder
        })
    }

    const savePimcoreSettings = (_elementId) => {
        const jsonconfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let pimcoreAgentsList = [];

        for (var i = 0; i < pimcoreSettingsRows; i++) {
            let settingId = pimcoreSettings[i] != undefined ? pimcoreSettings[i].pimcoreSettingid : 0;
            let objPimcoreSettings = {
                PimcoreSettingid: settingId,
                Officeid: +localOffice.officeid,
                WhiseOfficeid: +whiseOffice.id,
                FirstName: document.getElementById("pimcoreFName" + i).value,
                LastName: document.getElementById("pimcoreLName" + i).value,
                LoginId: document.getElementById("pimcoreLoginID" + i).value
            }
            pimcoreAgentsList.push(objPimcoreSettings);
        }


        //SavePimcoreSetting api call
        //save pimcore settings in database
        let url = variables.API_URL + `PimcoreSettings/SavePimcoreSetting?`;
        axios.post(url, pimcoreAgentsList, jsonconfig)
            .then((response) => {
                setPimcoreSettings(response.data);
                if (_elementId == "saveOfficeSettings") {
                    alert("Office settings successfully saved.");
                }
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
        //use the token to make further calls
    }

    const saveOfficeSettings = (e) => {
        //configurations to post json data
        const jsonconfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        //SaveOfficeDetail api call
        //save office settings in database
        let objOfficeSettings = {
            Officeid: 0,
            Clientid: currentClient.localclient.client.clientid,
            WhiseOfficeid: localOffice != undefined ? localOffice.whiseOfficeid : whiseOffice.id,
            CommercialName: whiseOffice.name,
            CrmDetail: "",
            OfficeImg: "",
            UniqueKey: "",
        }

        let url = variables.API_URL + `Office/SaveOfficeDetail?`;
        axios.post(url, JSON.stringify(objOfficeSettings), jsonconfig)
            .then((response) => {
                setLocalOffice(response.data);
                savePimcoreSettings(e.target.id);
                if (e.target.id == "addTrigger") {
                    showTriggerForm(response.data);
                }
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
        //use the token to make further calls
    }

    const EditTrigger = (e) => {

    }

    const DeleteTrigger = (e) => {

    }

    useEffect(() => {
        if (location.state != null) {
            getListOfOfficesFromStateBuilder();
        }
    }, [])

    return (
        <section className="client-setting">
            <div className="row py-3">
                <div className="col-sm-6">
                    <h4>{currentClient.name}</h4>
                </div>
            </div>
            <div className="pb-4 pt-2">
                {
                    offices.length > 0 ? offices.map(item => {
                        let activeClass = item.id == whiseOffice.id ? "office-active" : "";

                        return (
                            <span className={"name-tiles " + activeClass} onClick={officeSettingClickHandler} officedetail={JSON.stringify(item)}>{
                                item.name
                            }</span>
                        )
                    })
                        :
                        <></>
                }
            </div>
            <div className="card">
                <div className="row">
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Office Name</label>
                        <input className="form-control" defaultValue={whiseOffice.name} disabled />
                    </div>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <label className="mb-0"></label>
                        <input type="file" onChange={saveFile} accept="image/png, image/gif, image/jpeg" />
                    </div>
                </div>
            </div>
            <div className="card">
                <div>
                    <h6 className="sub-heading fw-bold mb-3">CRM Details:</h6>
                </div>
                <div className="row">
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>CRM Name</label>
                        <select className="form-select">
                            <option>Whise</option>
                            <option>Omnicasa</option>
                            <option>Sweepbright</option>
                            <option>Zabun</option>
                            <option>Apimo</option>
                            <option>Activimmo</option>
                        </select>
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Office ID</label>
                        <input type="text" className="form-control" defaultValue={whiseOffice.id} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Unique Key</label>
                        <input type="text" className="form-control" />
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h6 className="sub-heading fw-bold mb-3">PIMCORE Settings: </h6>
                    <button className="btn-site" id="addPimcoreSettings" onClick={addNewPimcoreSettingsRow}>Add Agent</button>
                </div>
                <div className="row">
                    <div className="col-sm-12" dangerouslySetInnerHTML={{ __html: pimcoreSettingsHtml }} />

                    <div className="col-sm-12 mb-3">
                        <button className="btn-site" id="addTrigger" onClick={saveOfficeSettings}>Add New Trigger</button>
                    </div>
                    <div className="col-sm-12">
                        <table className="w-100">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th>Key Moment</th>
                                    <th>Trigger Name</th>
                                    <th>Trigger Type</th>
                                    <th>Trigger Duration</th>
                                    <th>Duration Value</th>
                                    <th>Target Participent</th>
                                    <th>Target 1</th>
                                    <th>Target Participent</th>
                                    <th>Target 2</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    triggers.length > 0 ? triggers.map((item) => {
                                        return (
                                            <tr>
                                                <td className="border-start border-end border-bottom p-2 justify-content-center">{item.keyMoment}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.triggerName}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.triggerType}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.durationType}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center text-center">{item.durationValue}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.targetParticipent1}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.cTarget1}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.targetParticipent2}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.cTarget2}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">
                                                    <button className="btn-site btn-edit-trigger mb-1" onClick={EditTrigger}>Edit</button>
                                                    <button className="btn-site btn-delete-trigger" onClick={DeleteTrigger}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>No Trigger Found</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <button className="btn-site" id="saveOfficeSettings" onClick={saveOfficeSettings}>Save</button>
            </div>
        </section>
    );
}