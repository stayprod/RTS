import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import "draftail/dist/draftail.css";
import { convertToRaw, convertFromRaw } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE, UNDO_ICON } from "draftail";
import moment from 'moment';
import { useToken } from './tokenContext';
import { variables, validEmail, EnumobjTriggerType, EnumobjDurationType, EnumobjKeyMoments, EnumobjParticipentType } from '../Variables';

import { Trigger } from './Trigger';
import { PimcoreSettings } from './PimcoreSettings';

export const OfficeSettings = (props) => {
    const token = useToken();
    const [whiseOffices, setWhiseOffices] = useState({});
    const [whiseOffice, setWhiseOffice] = useState({});
    const [localOffice, setLocalOffice] = useState({});
    const [currentClient, setCurrentClient] = useState({});
    const [clientLocalOffices, setClientLocalOffices] = useState({});
    const [triggers, setTriggers] = useState({});
    const [showTriggerScreen, setShowTriggerScreen] = useState(false);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [pimcoreSettingsRows, setPimcoreSettingsRows] = useState(0);
    const [pimcoreSettings, setPimcoreSettings] = useState([]);
    const [settingsToBeRemoved, setSettingsToBeRemoved] = useState([]);
    const [showSMTPModal, setShowSMTPModal] = useState(false);
    const [smtpFormErrorMessage, setSmtpFormErrorMessage] = useState("");
    const [smptSetting, setSmptSetting] = useState({});

    let linkBuilder = "";

    const location = useLocation();
    const navigate = useNavigate();
    const optionElements = [];

    const getListOfOfficesFromStateBuilder = () => {
        //list of whise offices for a specific client
        setWhiseOffices(location.state.AllWhiseOffices);

        //selected office detail from whise
        setWhiseOffice(location.state.WhiseOffice);

        //client object including whise client detail and local database client detail
        setCurrentClient(location.state.CurrentClient);

        if (location.state.LocalOffice != undefined) {
            setLocalOffice(location.state.LocalOffice);
            getTriggersByOffice(location.state.LocalOffice);
            getSmtpSettings(location.state.LocalOffice);
            document.getElementById("crmName").value = location.state.LocalOffice.crmDetail;
            document.getElementById("crmUniqueKey").value = location.state.LocalOffice.uniqueKey;
        }
        if (location.state.LocalOfficesList != undefined) {
            setClientLocalOffices(location.state.LocalOfficesList);
        }
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

    const getSmtpSettings = async (_office) => {
        if (_office == undefined) {
            return
        }
        const response = await fetch(variables.API_URL + 'Client/GetSMTPDetail?officeid=' + _office.officeid);
        const jsonData = await response.json();
        if (jsonData != null) {
            setSmptSetting(jsonData);
            document.getElementById("smtpSettings").removeAttribute("disabled");
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
            setPimcoreSettingsRows(jsonData.length);
        }
        else {
            setPimcoreSettings(current => [...current, {
                pimcoreSettingid: 0,
                whiseOfficeid: 0,
                firstName: "",
                lastName: "",
                loginId: "",
                officeid: "",
            }]);
            setPimcoreSettingsRows(1);
        }
    }

    const addNewPimcoreSettingsRow = (e) => {
        if (pimcoreSettingsRows == 4) {
            alert("Maximum four agents are allowed");
            return
        }
        setPimcoreSettingsRows(prevState => prevState + 1);

        setPimcoreSettings(current => [...current, {
            pimcoreSettingid: 0,
            whiseOfficeid: 0,
            firstName: "",
            lastName: "",
            loginId: "",
            officeid: "",
        }]);
    }

    const removePimcoreSettingsRow = (e) => {
        if (pimcoreSettingsRows == 1) {
            return;
        }

        let element = e.target;
        //if (e.target.nodeName == "path") {
        //    element = e.target.parentNode.parentNode;
        //}
        //if (e.target.nodeName == "svg") {
        //    element = e.target.parentNode;
        //}

        const objSettings = JSON.parse(element.getAttribute("settingdetail"));
        const elementIndex = +element.getAttribute("parentid").split("-")[1];

        let settingsArray = [...pimcoreSettings]; // make a separate copy of the array

        let removedSettings = [...settingsToBeRemoved];

        if (objSettings.pimcoreSettingid != 0 && settingsToBeRemoved.indexOf(settingsArray[elementIndex]) == -1) {
            removedSettings.push(settingsArray[elementIndex]);
            setSettingsToBeRemoved(removedSettings);
        }
        settingsArray.splice(elementIndex, 1);
        setPimcoreSettings(settingsArray);

        setPimcoreSettingsRows(prevState => prevState - 1);
    }

    const officeSettingClickHandler = (e) => {
        let _whiseOffice = JSON.parse(e.target.getAttribute("officedetail"));

        const stateBuilder = {
            WhiseOffice: _whiseOffice,
            AllWhiseOffices: whiseOffices,
            CurrentClient: currentClient
        }

        const localOffices = clientLocalOffices;

        if (localOffices != undefined && Object.keys(localOffices).length !== 0) {
            //filtering out locally saved office 
            const l_office = localOffices?.filter(item => {
                return item.whiseOfficeid == _whiseOffice.id
            })
            stateBuilder.LocalOffice = l_office[0];
            stateBuilder.LocalOfficesList = localOffices;
        }

        const url = "/OfficeSettings/" + _whiseOffice.id;

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

    const showTriggerForm = (_office, trigger) => {

        const stateBuilder = {
            LocalOfficeDetail: _office,
            WhiseOffice: whiseOffice,
            ClientDetail: currentClient,
            AllWhiseOffices: whiseOffices,
            LocalOfficesList: clientLocalOffices
        }
        if (trigger != undefined) {
            stateBuilder.TriggerDetail = trigger;
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

    const removePimcoreSettings = () => {

        //DeletePimcoreSetting api call
        //remove pimcore settings from database
        let url = variables.API_URL + `PimcoreSettings/DeletePimcoreSetting?`;
        axios.delete(url, { data: settingsToBeRemoved })
            .then((response) => {
                setSettingsToBeRemoved([]);
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
    }

    const saveOfficeSettings = (e) => {
        let isRequiredFieldsEmpty = false; 

        if (currentClient.localclient == undefined) {
            alert("Please save client settings first");
            return;
        }

        if (document.getElementById("crmName").value == "") {
            document.getElementById("crmName").style.borderColor = "red";
            isRequiredFieldsEmpty = true;
        }

        if (document.getElementById("crmUniqueKey").value == "") {
            document.getElementById("crmUniqueKey").style.borderColor = "red";
            isRequiredFieldsEmpty = true;
        }

        if (document.getElementById("pimcoreFName0").value == "") {
            document.getElementById("pimcoreFName0").style.borderColor = "red";
            isRequiredFieldsEmpty = true;
        }

        if (document.getElementById("pimcoreLoginID0").value == "") {
            document.getElementById("pimcoreLoginID0").style.borderColor = "red";
            isRequiredFieldsEmpty = true;
        }

        if (isRequiredFieldsEmpty == true) {
            alert("Please filled the required fields");
            return;
        }

        //configurations to post json data
        const jsonconfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        //SaveOfficeDetail api call
        //save office settings in database
        let objOfficeSettings = {
            Officeid: localOffice.officeid != undefined ? localOffice.officeid : 0,
            Clientid: currentClient.localclient?.client.clientid,
            WhiseOfficeid: localOffice.length != undefined ? localOffice.whiseOfficeid : whiseOffice.id,
            CommercialName: whiseOffice.name,
            CrmDetail: document.getElementById("crmName").value,
            OfficeImg: "",
            UniqueKey: document.getElementById("crmUniqueKey").value,
            SmtpSettingid: document.getElementById("smtpSettings").checked == true ? 1 : 0
        }

        let url = variables.API_URL + `Office/SaveOfficeDetail?`;
        axios.post(url, JSON.stringify(objOfficeSettings), jsonconfig)
            .then((response) => {

                //uploadImage();
                setLocalOffice(response.data);

                location.state.LocalOffice = response.data;
                if (location.state.LocalOfficesList == undefined) {
                    location.state.LocalOfficesList = [];
                }
                const existingOfficeInDb = location.state.LocalOfficesList.filter(item => {
                    return item.officeid == response.data.officeid;
                })
                if (existingOfficeInDb.length == 0) {
                    location.state.LocalOfficesList.push(response.data);
                }
                else {
                    const indexOfExistedOffice = location.state.LocalOfficesList.indexOf(existingOfficeInDb[0]);
                    location.state.LocalOfficesList[indexOfExistedOffice] = response.data;
                }

                setClientLocalOffices(location.state.LocalOfficesList);
                if (settingsToBeRemoved.length > 0) {
                    removePimcoreSettings();
                }
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
        let trigger = JSON.parse(e.target.getAttribute("trigger"));
        showTriggerForm(localOffice, trigger);
    }

    const DeleteTrigger = (e) => {
        const trigger = JSON.parse(e.target.getAttribute("trigger"));

        //DeleteTrigger api call
        //remove office trigger from database
        let url = variables.API_URL + `OfficeTrigger/DeleteTrigger?triggerId=${trigger.officeTriggerid}`;
        axios.delete(url)
            .then((response) => {
                let triggersList = [...triggers];

                let id = trigger.officeTriggerid;

                let index = triggersList.findIndex(x => x.officeTriggerid === id);

                triggersList.splice(index, 1);

                setTriggers(current => triggersList);

                alert("Trigger deleted successfully.");
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
    }

    const openSMTPModal = (e) => {
        setShowSMTPModal(true);
    }
    const hideSMTPModal = () => {
        setShowSMTPModal(false);
        //document.getElementById("smtpSettings").checked = false;
    }

    const resetOfficeSettingFields = (e) => {
        if (e.target.style.borderColor == "red") {
            e.target.style.borderColor = "#ced4da";
        }
    }

    //update empty pimcoresetting object values when user type anything in newly added row of pimcore settings
    const setStateValueOfPimcoreFieldsOnBlur = (e) => {
        const objSettings = JSON.parse(e.target.getAttribute("settingobj"));
        const elementIndex = +e.target.getAttribute("parentid").split("-")[1];

        let settingsArray = [...pimcoreSettings]; // make a separate copy of the array

        if (e.target.id.indexOf("pimcoreFName") != -1) {
            settingsArray[elementIndex].firstName = e.target.value;
        }
        if (e.target.id.indexOf("pimcoreLName") != -1) {
            settingsArray[elementIndex].lastName = e.target.value;
        }
        if (e.target.id.indexOf("pimcoreLoginID") != -1) {
            settingsArray[elementIndex].loginId = e.target.value;
        }
        setPimcoreSettings(settingsArray);
    }

    const resetSMTPFormFieldsStyle = (e) => {
        if (e.target.style.borderColor == "red") {
            e.target.style.borderColor = "#ced4da";
            setSmtpFormErrorMessage("");
        }
    }

    const saveSmtpSetting = (e) => {
        if (location.state.LocalOffice == undefined) {
            alert("Please save office settings first");
            return;
        }
        let isFRequiredFieldsEmpty = false;
        const emailProvider = document.getElementById("emailProviders");
        //const smtpUserName = document.getElementById("smtpUserName");
        const smtpPassword = document.getElementById("smtpPassword");
        const smtpServer = document.getElementById("smtpServer");
        const smtpPort = document.getElementById("smtpPort");
        const sslSetting = document.getElementById("sslSetting");

        if (emailProvider.value == "") {
            emailProvider.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        } // 
        //if (smtpUserName.value == "") {
        //    smtpUserName.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}
        if (smtpPassword.value == "") {
            smtpPassword.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (smtpServer.value == "") {
            smtpServer.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (smtpPort.value == "") {
            smtpPort.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }

        if (isFRequiredFieldsEmpty == true) {
            setSmtpFormErrorMessage("Please fill the required fields");
            return
        }

        let isValidEmail = false;
        isValidEmail = validEmail.test(emailProvider.value);

        if (isValidEmail == false) {
            emailProvider.style.borderColor = "red";
            setSmtpFormErrorMessage("Please enter a valid email");
            return
        }

        //configurations to post json data
        const jsonconfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        //SaveSMTPSettings api call
        //Api call to save smtp settings for an client
        let objSMTPClient = {
            Settingid: smptSetting.settingid != undefined ? smptSetting.settingid : 0 ,
            Clientid: currentClient.localclient != undefined ? +currentClient.localclient.client.clientid : 0,
            Officeid: +localOffice.officeid,
            WhiseClientid: +currentClient.id,
            WhiseOfficeid: +whiseOffice.id,
            EmailProvider: emailProvider.value,
            UserName: "",
            Password: smtpPassword.value,
            ImapServer: smtpServer.value,
            Port: smtpPort.value,
            SslSetting: sslSetting.checked == true ? 1 : 0
        }
        let url = variables.API_URL + `Client/SaveSMTPSettings?`;
        return axios.post(url, JSON.stringify(objSMTPClient), jsonconfig)
            .then((response) => {
                setSmptSetting(response.data);
                alert("SMTP settings successfully saved.");
                setShowSMTPModal(false);
                document.getElementById("smtpSettings").removeAttribute("disabled");
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
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
                    whiseOffices.length > 0 ? whiseOffices.map(item => {
                        let activeClass = item.id == whiseOffice.id ? "office-active" : "";

                        return (
                            <button className={"name-tiles " + activeClass} onClick={officeSettingClickHandler} officedetail={JSON.stringify(item)}>{
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
                        <select className="form-select" id="crmName" onChange={resetOfficeSettingFields}>
                            <option value="">Select an option</option>
                            <option value="1">Whise</option>
                            <option value="2">Omnicasa</option>
                            <option value="3">Sweepbright</option>
                            <option value="4">Zabun</option>
                            <option value="5">Apimo</option>
                            <option value="6">Activimmo</option>
                        </select>
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Office ID</label>
                        <input type="text" className="form-control" defaultValue={whiseOffice.id} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Unique Key</label>
                        <input type="text" className="form-control" id="crmUniqueKey" onInput={resetOfficeSettingFields} />
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="d-flex justify-content-between">
                    <h6 className="sub-heading fw-bold mb-3">PIMCORE Settings: </h6>
                    <button className="btn-site" id="addPimcoreSettings" onClick={addNewPimcoreSettingsRow}>Add Agent</button>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <PimcoreSettings pcSettingsList={pimcoreSettings} removePimcoreSettings={removePimcoreSettingsRow} resetRequireField={resetOfficeSettingFields} onBlurHandler={setStateValueOfPimcoreFieldsOnBlur} />
                    </div>
                    <div className="col-sm-12 mb-3">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input me-2" type="checkbox" name="smtpSettingsCheckbox" id="smtpSettings" defaultChecked={localOffice.smtpSettingid} disabled />
                            <label className="form-check-label mb-0" htmlFor="smtpSettings">Send email using custom SMTP</label>
                        </div>
                        <button className="btn-site ms-4" onClick={openSMTPModal}>SMTP Settings</button>
                        <Modal className="smtp-modal" id="SMTPModal" show={showSMTPModal} onHide={hideSMTPModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>SMTP Settings</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-sm-12 mb-3">
                                        <label>Username*</label>
                                        <input type="text" className="form-control" id="emailProviders" onInput={resetSMTPFormFieldsStyle} defaultValue={smptSetting.emailProvider} />
                                    </div>
                                    <div className="col-sm-12 mb-3 d-none">
                                        <label>Username*</label>
                                        <input type="text" className="form-control" id="smtpUserName" onInput={resetSMTPFormFieldsStyle} />
                                    </div>
                                    <div className="col-sm-12 mb-3">
                                        <label>password*</label>
                                        <input type="password" className="form-control" id="smtpPassword" onInput={resetSMTPFormFieldsStyle} defaultValue={smptSetting.password} />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label>IMAP Server*</label>
                                        <input type="text" className="form-control" id="smtpServer" onInput={resetSMTPFormFieldsStyle} defaultValue={smptSetting.imapServer} />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label>Port*</label>
                                        <input type="text" className="form-control" id="smtpPort" onInput={resetSMTPFormFieldsStyle} defaultValue={smptSetting.port} />
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" name="sslCheckbox" id="sslSetting" defaultValue={smptSetting.sslSetting} />
                                            <label className="form-check-label mb-0" htmlFor="sslSetting" >SSL</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <span className="text-danger">{smtpFormErrorMessage}</span>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn-site" onClick={saveSmtpSetting}>Save</button>
                            </Modal.Footer>
                        </Modal>
                    </div>
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
                                    <th>Target Participent</th>
                                    {/*<th>Target 1</th>*/}
                                    <th>Created On</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    triggers.length > 0 ? triggers.map((item) => {
                                        const length = JSON.parse(item.cTarget1).length;
                                        //new Date();
                                        const createdOn = moment(item.createdOn).format('MMMM Do YYYY, h:mm:ss a');
                                        return (
                                            <tr>
                                                <td className="border-start border-end border-bottom p-2 justify-content-center">{EnumobjKeyMoments[item.keyMoment]}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{item.triggerName}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{EnumobjTriggerType[item.triggerType]}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center text-center">{"(" + item.durationValue + ") " + EnumobjDurationType[item.durationType]}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">{EnumobjParticipentType[item.targetParticipant1]}</td>
                                                {/*<td className="border-end border-bottom p-2 justify-content-center">{*/}
                                                {/*    length > 0 ? JSON.parse(item.cTarget1).map((target, i) => {*/}
                                                {/*        let symbol = i < length - 1 ? ", " : "";*/}
                                                {/*        return target.label + symbol;*/}
                                                {/*    })*/}
                                                {/*        : ""*/}
                                                {/*}</td>*/}
                                                <td className="border-end border-bottom p-2 justify-content-center">{createdOn}</td>
                                                <td className="border-end border-bottom p-2 justify-content-center">
                                                    <button className="btn-site btn-edit-trigger mb-1" onClick={EditTrigger} trigger={JSON.stringify(item)}>Edit</button>
                                                    <button className="btn-site btn-delete-trigger" onClick={DeleteTrigger} trigger={JSON.stringify(item)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>No Trigger Found</td>
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