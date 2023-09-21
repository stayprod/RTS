import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import "draftail/dist/draftail.css"
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE, UNDO_ICON } from "draftail";
import { useToken } from './tokenContext';
import { variables } from '../Variables';

import { EmailLayoutModal } from './EmailLayout';

const options = [
    { label: "to sale", value: "to sale" },
    { label: "to rent", value: "to rent" },
    { label: "annuity sale", value: "annuity sale" },
];

export const OfficeSettings = (props) => {
    const token = useToken();
    const [offices, setOffices] = useState({});
    const [data, setData] = useState([]);
    const [currentOffice, setCurrentOffice] = useState({});
    const [currentClient, setCurrentClient] = useState({});
    const [officeLayout, setOfficeLayouts] = useState({});
    const [showTriggerScreen, setShowTriggerScreen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [selected, setSelected] = useState([]);
    const [symbol, setSymbol] = useState("+");
    const [keyMoment, setKeyMoment] = useState("Trigger:");
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [showLayoutModal, setShowLayoutModal] = useState(false);
    const [layoutModalTitle, setLayoutModalTitle] = useState("");
    const [layoutModalType, setLayoutModalType] = useState("");
    const [selectedLaytOutId, setSelectedLaytOutId] = useState(0);
    const [selectedLaytName, setSelectedLaytName] = useState("");
    const [officeId, setOfficeId] = useState(0);
    const [clientId, setClientId] = useState(0);

    let linkBuilder = "";
    let participentType = [];

    const location = useLocation();
    const navigate = useNavigate();
    const optionElements = [];

    const getListOfOfficesFromStateBuilder = () => {
        setOffices(location.state.AllOffices);
        setCurrentOffice(location.state.CurrentOffice);
        setCurrentClient(location.state.CurrentClient);
    }

    const getListOfLayoutsByOffice = async () => {
        const response = await fetch(variables.API_URL + 'Layout/GetLayoutsByOffice?officeId=' + location.state.CurrentOffice.id);
        const jsonData = await response.json();
        if (jsonData != null) {
            setOfficeLayouts(jsonData)
        }
    }

    const officeSettingClickHandler = (e) => {
        let office = JSON.parse(e.target.getAttribute("officedetail"));

        const stateBuilder = {
            CurrentOffice: office,
            AllOffices: offices,
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

    const showTriggerForm = (e) => {

        if (symbol == "+") {
            setSymbol("-");
        }
        else {
            setSymbol("+");
        }
        setShowTriggerScreen(prevState => !prevState);
    }

    const setKeyMomentForTrigger = (e) => {
        let value = e.target.value;
        setKeyMoment("Trigger - " + value);
    }

    const onChangeOfDurationType = (e) => {
        let value = e.target.value;
        if (value != "") {
            document.getElementById("durationValue").removeAttribute("disabled");
        }
        else {
            document.getElementById("durationValue").value = "";
            document.getElementById("durationValue").setAttribute("disabled", true);
        }
    }

    const createNewSurveyEmail = (e) => {

    }

    const setListOfTargetType = (e) => {
        let value = e.target.value;
        let html = ""
        if (participentType.indexOf(value) == -1 && value != "") {
            participentType.push(value);
        }
        document.getElementById("surveyTypeCheckboxes").innerHTML = "";

        html += `<label class="me-3 mb-0 fw-bold">Survey Email:</label>`;
        html += `<div class="form-check form-check-inline me-2">
                    <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineParticipent" />
                    <label class="form-check-label mb-0" for="inlineParticipent" >Participent</label>
                </div>`

        participentType.forEach((item) => {
            html += `<div class="form-check form-check-inline me-2">
                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inline${item}" />
                        <label class="form-check-label mb-0" for="inline${item}" >${item}</label>
                    </div>`
        })

        document.getElementById("surveyTypeCheckboxes").innerHTML += html;
    }

    const generateSurveyLink = (e) => {
        let checked = e.target.checked;
        let value = e.target.value;
        let link = document.getElementById("surveyLink").value;
        let id = e.target.id;

        if (checked == false) {
            let newLink = ""
            if (id == "checkboxAgent" && link.indexOf("&agent") > -1) {
                newLink = link.replace("&agent=" + value, "");
            }
            else if (id == "checkboxAgent") {
                newLink = link.replace("agent=" + value, "");
            }
            if (id == "checkboxOffice" && link.indexOf("&office") > -1) {
                newLink = link.replace("&office=" + value, "");
            }
            else if (id == "checkboxOffice") {
                newLink = link.replace("office=" + value, "");
            }
            if (id == "checkboxDob" && link.indexOf("&DOB") > -1) {
                newLink = link.replace("&DOB=" + value, "");
            }
            else if (id == "checkboxDob") {
                newLink = link.replace("DOB=" + value, "");
            }

            document.getElementById("surveyLink").value = newLink;
        }
        else {
            if (id == "checkboxAgent") {
                if (linkBuilder == "") {
                    linkBuilder += "agent=" + value;
                }
                else {
                    linkBuilder = "";
                    linkBuilder += "&agent=" + value;
                }
            }
            if (id == "checkboxOffice") {
                if (linkBuilder == "") {
                    linkBuilder += "office=" + value;
                }
                else {
                    linkBuilder = "";
                    linkBuilder += "&office=" + value;
                }
            }
            if (id == "checkboxDob") {
                if (linkBuilder == "") {
                    linkBuilder += "DOB=" + value;
                }
                else {
                    linkBuilder = "";
                    linkBuilder += "&DOB=" + value;
                }
            }

            link += linkBuilder;
            document.getElementById("surveyLink").value = link;
        }
    }

    const setSelectedEmailLayout = (e) => {
        let value = e.target.value;
        if (value != "") {
            setSelectedLaytOutId(value);
            var index = e.target.selectedIndex;
            setSelectedLaytName(e.target[index].text);
        }
        else {
            setSelectedLaytName("");
        }
    }

    const hideLayoutModal = (e) => {
        setShowLayoutModal(false);
    }

    const openLayoutModal = (e) => {
        if (e.target.innerText == "New") {
            setShowLayoutModal(true);
            setLayoutModalTitle("New Layout");
            setLayoutModalType("new");
            setOfficeId(currentOffice.id);
            setClientId(currentClient.id);
        }
        else {
            if (document.getElementById("layoutDropdown").value == "") {
                alert("No layout selected for preview");
                return
            }
            setShowLayoutModal(true);
            setLayoutModalTitle(selectedLaytName + " Layout Preview");
            setLayoutModalType("preview");
            setOfficeId(currentOffice.id);
            setClientId(currentClient.id);
        }
    }

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const uploadFile = async () => {
        debugger;
        const formData = new FormData();
        formData.append("formFile", file);
        formData.append("fileName", fileName);
        try {

            let url = variables.API_URL + `File/ImageUpload?`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const jsonData = await response.json();

            return jsonData;
        }
        catch (ex) {
            console.log(ex)
        }
    }

    const saveOfficeTrigger = () => {
        let objOfficeTrigger = {
            OfficeTriggerid: 0,
            Officeid: currentOffice.id,
            TriggerName: document.getElementById("tname").value,
            KeyMoment: "",
            TriggerType: "",
            DurationType: "",
            DurationValue: "",
            TargetParticipant1: "",
            CTarget1: "",
            TargetParticipant2: "",
            CTarget2: "",
        }
    }

    const saveOfficeSettings = (e) => {
        let imgPath = uploadFile();

        let objOfficeSettings = {
            Officeid: 0,
            WhiseOfficeid: currentOffice.id,
            CommercialName: currentOffice.name,
            CrmDetail: "",
            OfficeImg: imgPath,
            UniqueKey: "",
        }

        let url = variables.API_URL + `Office/SaveOfficeDetail?`;

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // ASP.NET Core API endpoint with headers
        axios.post(url, JSON.stringify(objOfficeSettings), config)
            .then(response => {
                uploadFile(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {

        if (location.state != null) {
            getListOfOfficesFromStateBuilder();
            getListOfLayoutsByOffice();
        }
        if (token == undefined) {
            return
        }
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        axios.post('https://api.whise.eu/v1/calendars/actions/list', {}, config) // ASP.NET Core API endpoint with headers
            .then(response => {
                setData(response.data.calendarActions);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [token])

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
                        let activeClass = item.id == currentOffice.id ? "office-active" : "";

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
                        <input className="form-control" value={currentOffice.name} disabled />
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
                        <label>Commercial Name</label>
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
                        <input type="text" className="form-control" value={currentOffice.id} />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-0">
                        <label>Unique Key</label>
                        <input type="text" className="form-control" />
                    </div>
                </div>
            </div>
            <div className="card">
                <div>
                    <h6 className="sub-heading fw-bold mb-3">PIMCORE Settings:</h6>
                </div>
                <div className="row">
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label>Agent</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label>Name</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label>Key</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label className="d-md-none d-sm-block">Agent</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label className="d-md-none d-sm-block">Name</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3 mb-md-3">
                        <label className="d-md-none d-sm-block">Key</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label className="d-md-none d-sm-block">Agent</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label className="d-md-none d-sm-block">Name</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-4 mb-3">
                        <label className="d-md-none d-sm-block">Key</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="col-sm-12 mb-3">
                        <button className="btn-site" onClick={showTriggerForm}>Add a Trigger {symbol} </button>
                    </div>
                </div>
                {
                    showTriggerScreen == true ?
                        <>
                            <div>
                                <h6 className="sub-heading fw-bold mb-3">{keyMoment}</h6>
                            </div>
                            <div className="row">
                                <div className="col-sm-4 mb-3">
                                    <label>Trigger Name</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Key Moment</label>
                                    <select className="form-select" onChange={setKeyMomentForTrigger}>
                                        <option value="">Select an option</option>
                                        <option value="Evaluation (to sale)">Evaluation (to sale)</option>
                                        <option value="Evaluation (to rent)">Evaluation (to rent)</option>
                                        <option value="After mandate (to sale)">After mandate (to sale)</option>
                                        <option value="After mandate (to rent)">After mandate (to rent)</option>
                                        <option value="Visits (to sale)">Visits (to sale)</option>
                                        <option value="Visits (to rent)">Visits (to rent)</option>
                                        <option value="Sale agreement">Sale agreement</option>
                                        <option value="Rental agreement">Rental agreement</option>
                                        <option value="Notarial deed">Notarial deed</option>
                                        <option value="Entry inventory">Entry inventory</option>
                                        <option value="Exit inventory">Exit inventory</option>
                                    </select>
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Trigger Type</label>
                                    <select className="form-select">
                                        <option value="">Select an option</option>
                                        <option>Email</option>
                                        <option>SMS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Type of Duration</label>
                                    <select className="form-select" onChange={onChangeOfDurationType}>
                                        <option value="">Select an option</option>
                                        <option value="Days">Days</option>
                                        <option value="Hours">Hours</option>
                                        <option value="Minutes">Minutes</option>
                                    </select>
                                </div>
                                <div className="col-sm-12 col-md-2 mb-3">
                                    <label>Value</label>
                                    <input type="number" className="form-control" id="durationValue" disabled />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Target</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>C-Target</label>
                                    <select className="form-select" id="ctarget1" onChange={setListOfTargetType}>
                                        <option value="">Select an option</option>
                                        <option value="Owner">Owner</option>
                                        <option value="Lessor">Lessor</option>
                                        <option value="Buyer">Buyer</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Target</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>C-Target</label>
                                    <select className="form-select" id="ctarget2" onChange={setListOfTargetType}>
                                        <option value="">Select an option</option>
                                        <option value="Owner">Owner</option>
                                        <option value="Lessor">Lessor</option>
                                        <option value="Buyer">Buyer</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Target</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>C-Target</label>
                                    <select className="form-select" id="ctarget3" onChange={setListOfTargetType}>
                                        <option value="">Select an option</option>
                                        <option value="Owner">Owner</option>
                                        <option value="Lessor">Lessor</option>
                                        <option value="Buyer">Buyer</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Target</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>C-Target</label>
                                    <select className="form-select" id="ctarget4" onChange={setListOfTargetType}>
                                        <option value="">Select an option</option>
                                        <option value="Owner">Owner</option>
                                        <option value="Lessor">Lessor</option>
                                        <option value="Buyer">Buyer</option>
                                        <option value="Tenant">Tenant</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h6 className="sub-heading fw-bold mb-3">Condition:</h6>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>WHISE</label>
                                    <select className="form-select">
                                        <option value="">Select an option</option>
                                        {data?.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}({option.id})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedOption && <p>Selected: {selectedOption}</p>}
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Property Transaction Type</label>
                                    {/*<select className="form-select">*/}
                                    {/*    <option>Email</option>*/}
                                    {/*    <option>SMS</option>*/}
                                    {/*</select>*/}
                                    <MultiSelect
                                        className="multiselect"
                                        options={options}
                                        value={selected}
                                        onChange={setSelected}
                                        labelledBy="Select"
                                    />
                                </div>
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Property Transaction Type</label>
                                    <select className="form-select">
                                        <option>Email</option>
                                        <option>SMS</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h6 className="sub-heading fw-bold mb-3">Select Email Configuration:</h6>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3" id="surveyTypeCheckboxes">
                                    <label className="me-3 mb-0 fw-bold">Survey Email:</label>
                                    <div class="form-check form-check-inline me-2">
                                        <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineParticipent" />
                                        <label class="form-check-label mb-0" for="inlineParticipent" >Participent</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label className="me-3">Layout</label>
                                    <div className="d-flex">
                                        <select className="form-select" id="layoutDropdown" onChange={setSelectedEmailLayout}>
                                            <option value="">--Select Layout--</option>
                                            {
                                                officeLayout.length > 0 ? officeLayout.map((item) => {
                                                    return (
                                                        <option value={item.layoutid}>{item.layoutName}</option>
                                                    )
                                                })
                                                    :
                                                    ""
                                            }
                                        </select>
                                        <button className="btn-site ms-1" onClick={openLayoutModal}>
                                            New
                                        </button>
                                        <button className="btn-site ms-1" onClick={openLayoutModal}>
                                            View
                                        </button>
                                        <EmailLayoutModal
                                            showModal={showLayoutModal}
                                            modalTitle={layoutModalTitle}
                                            modalType={layoutModalType}
                                            officeId={officeId}
                                            clientId={clientId}
                                            hideLayoutModal={hideLayoutModal}
                                            layoutId={selectedLaytOutId}
                                            reloadLayoutsList={getListOfLayoutsByOffice}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Tabs
                                defaultActiveKey="french"
                                id="text-tabs"
                                className="mb-3"
                            >
                                <Tab eventKey="french" title="French">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                                <DraftailEditor
                                                    rawContentState={null}
                                                    blockTypes={[
                                                        { type: BLOCK_TYPE.HEADER_ONE },
                                                        { type: BLOCK_TYPE.HEADER_TWO },
                                                        { type: BLOCK_TYPE.HEADER_THREE },
                                                        { type: BLOCK_TYPE.HEADER_FOUR },
                                                        { type: BLOCK_TYPE.HEADER_FIVE },
                                                        { type: BLOCK_TYPE.HEADER_SIX },
                                                        { type: BLOCK_TYPE.BLOCKQUOTE },
                                                        { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                                                        { type: BLOCK_TYPE.ORDERED_LIST_ITEM }
                                                    ]}
                                                    inlineStyles={
                                                        [
                                                            { type: INLINE_STYLE.BOLD },
                                                            { type: INLINE_STYLE.ITALIC },
                                                            { type: INLINE_STYLE.CODE },
                                                            { type: INLINE_STYLE.UNDERLINE },
                                                            { type: INLINE_STYLE.STRIKETHROUGH },
                                                            { type: INLINE_STYLE.SUBSCRIPT },
                                                            { type: INLINE_STYLE.SUPERSCRIPT },
                                                            { type: INLINE_STYLE.MARK },
                                                            { type: INLINE_STYLE.SMALL },
                                                            { type: INLINE_STYLE.INSERT },
                                                            { type: INLINE_STYLE.DELETE },
                                                            { type: INLINE_STYLE.QUOTATION }
                                                        ]}
                                                    entityTypes={[
                                                        { type: ENTITY_TYPE.LINK },
                                                        { type: ENTITY_TYPE.IMAGE }
                                                    ]}
                                                />
                                            <button class="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="dutch" title="Dutch">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                            <DraftailEditor
                                                rawContentState={null}
                                                blockTypes={[
                                                    { type: BLOCK_TYPE.HEADER_ONE },
                                                    { type: BLOCK_TYPE.HEADER_TWO },
                                                    { type: BLOCK_TYPE.HEADER_THREE },
                                                    { type: BLOCK_TYPE.HEADER_FOUR },
                                                    { type: BLOCK_TYPE.HEADER_FIVE },
                                                    { type: BLOCK_TYPE.HEADER_SIX },
                                                    { type: BLOCK_TYPE.BLOCKQUOTE },
                                                    { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                                                    { type: BLOCK_TYPE.ORDERED_LIST_ITEM }
                                                ]}
                                                inlineStyles={
                                                    [
                                                        { type: INLINE_STYLE.BOLD },
                                                        { type: INLINE_STYLE.ITALIC },
                                                        { type: INLINE_STYLE.CODE },
                                                        { type: INLINE_STYLE.UNDERLINE },
                                                        { type: INLINE_STYLE.STRIKETHROUGH },
                                                        { type: INLINE_STYLE.SUBSCRIPT },
                                                        { type: INLINE_STYLE.SUPERSCRIPT },
                                                        { type: INLINE_STYLE.MARK },
                                                        { type: INLINE_STYLE.SMALL },
                                                        { type: INLINE_STYLE.INSERT },
                                                        { type: INLINE_STYLE.DELETE },
                                                        { type: INLINE_STYLE.QUOTATION }
                                                    ]}
                                                entityTypes={[
                                                    { type: ENTITY_TYPE.LINK },
                                                    { type: ENTITY_TYPE.IMAGE }
                                                ]}
                                            />
                                            <button class="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="english" title="English">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                            <DraftailEditor
                                                rawContentState={null}
                                                blockTypes={[
                                                    { type: BLOCK_TYPE.HEADER_ONE },
                                                    { type: BLOCK_TYPE.HEADER_TWO },
                                                    { type: BLOCK_TYPE.HEADER_THREE },
                                                    { type: BLOCK_TYPE.HEADER_FOUR },
                                                    { type: BLOCK_TYPE.HEADER_FIVE },
                                                    { type: BLOCK_TYPE.HEADER_SIX },
                                                    { type: BLOCK_TYPE.BLOCKQUOTE },
                                                    { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                                                    { type: BLOCK_TYPE.ORDERED_LIST_ITEM }
                                                ]}
                                                inlineStyles={
                                                    [
                                                        { type: INLINE_STYLE.BOLD },
                                                        { type: INLINE_STYLE.ITALIC },
                                                        { type: INLINE_STYLE.CODE },
                                                        { type: INLINE_STYLE.UNDERLINE },
                                                        { type: INLINE_STYLE.STRIKETHROUGH },
                                                        { type: INLINE_STYLE.SUBSCRIPT },
                                                        { type: INLINE_STYLE.SUPERSCRIPT },
                                                        { type: INLINE_STYLE.MARK },
                                                        { type: INLINE_STYLE.SMALL },
                                                        { type: INLINE_STYLE.INSERT },
                                                        { type: INLINE_STYLE.DELETE },
                                                        { type: INLINE_STYLE.QUOTATION }
                                                    ]}
                                                entityTypes={[
                                                    { type: ENTITY_TYPE.LINK },
                                                    { type: ENTITY_TYPE.IMAGE }
                                                ]}
                                            />
                                            <button class="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Link</label>
                                    <input type="text" className="form-control" id="surveyLink" value="https://survey.realadvice.be/TRIOR/?" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxAgent" value="Harold+Salm" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" for="checkboxAgent" >Agent</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxOffice" value="office" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" for="checkboxOffice" >Office</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxDob" value="07-15-1996" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" for="checkboxDob" >DOB</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxLanguage" value="du" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" for="checkboxLanguage" >Language</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" name="activateReminderOptions" id="activateReminder" value="option1" />
                                        <label class="form-check-label" for="activateReminder">Activate Reminder</label>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button class="btn-site" onClick={createNewSurveyEmail}>Create New Version of Email</button>
                            </div>
                        </>
                        :
                        ""
                }
            </div>

            <div className="mb-4">
                <button className="btn-site" onClick={saveOfficeSettings}>Save</button>
            </div>
        </section>
    );
}