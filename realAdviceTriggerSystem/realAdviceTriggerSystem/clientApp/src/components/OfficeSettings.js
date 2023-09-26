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
    const [emailTexte, setEmailTexte] = useState("");
    const [selectedTab, setSelectedTab] = useState("french");

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
        const filename = e.target.files[0].name;
        const extension = filename.split(".")[1];
        const finalName = currentOffice.name.replace(/ /g, "") + "." + extension;
        setFileName(finalName);
    }

    const saveTrigger = (office) => {

        //configurations to post json data
        const jsonconfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        //SaveOfficeTriggerDetail api call
        //Api call to save trigger for an office
        let language = selectedTab.e;
        let trigger = {};
        let objOfficeTrigger = {
            OfficeTriggerid: 0,
            Officeid: +office.officeid,
            Layoutid: +selectedLaytOutId,
            TriggerName: document.getElementById("tname").innerText,
            KeyMoment: document.getElementById("keymomentDropdown").value,
            TriggerType: document.getElementById("triggertypeDropdown").value,
            DurationType: document.getElementById("durationtypeDropdown").value,
            DurationValue: +document.getElementById("durationValue").value,
            TargetParticipant1: document.getElementById("participent1").value,
            CTarget1: document.getElementById("ctarget1").value,
            TargetParticipant2: document.getElementById("participent2").value,
            CTarget2: document.getElementById("ctarget2").value,
            Language: language,
            Texte: emailTexte,
        }
        let triggerurl = variables.API_URL + `OfficeTrigger/SaveOfficeTriggerDetail?`;
        return axios.post(triggerurl, JSON.stringify(objOfficeTrigger), jsonconfig)
            .then((response) => {
                response.data
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
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

    const saveOfficeSettings = (e) => {
        //uploadImage().then((imgPath) => {
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
                WhiseOfficeid: currentOffice.id == undefined ? currentOffice.whiseOfficeid : currentOffice.id,
                CommercialName: currentOffice.name,
                CrmDetail: "",
                OfficeImg: "",
                UniqueKey: "",
            }
            let url = variables.API_URL + `Office/SaveOfficeDetail?`;
            axios.post(url, JSON.stringify(objOfficeSettings), jsonconfig)
                .then((response) => {
                    debugger;
                    setCurrentOffice(response.data);
                    saveTrigger(response.data).then((data) => {
                        alert("Office settings successfully saved.")
                    })
                })
                .catch(error => {
                    alert('Error fetching data:', error);
                });
        //});
        //use the token to make further calls
    }

    const exporterConfigForTexte = {
        blockToHTML: (block) => {
            if (block.type === BLOCK_TYPE.BLOCKQUOTE) {
                return <blockquote />
            }

            // Discard atomic blocks, as they get converted based on their entity.
            if (block.type === BLOCK_TYPE.ATOMIC) {
                return {
                    start: "",
                    end: "",
                }
            }

            return null
        },

        entityToHTML: (entity, originalText) => {
            if (entity.type === ENTITY_TYPE.LINK) {
                return <a href={entity.data.url}>{originalText}</a>
            }

            if (entity.type === ENTITY_TYPE.IMAGE) {
                return <img src={entity.data.src} alt={entity.data.alt} />
            }

            if (entity.type === ENTITY_TYPE.HORIZONTAL_RULE) {
                return <hr />
            }

            return originalText
        },
    }

    const convertTexteToHtml = (raw) => {
        raw ? setEmailTexte(convertToHTML(exporterConfigForTexte)(convertFromRaw(raw))) : "";
        console.log(emailTexte);
    }

    const handleTabSelect = (e) => {
        setSelectedTab({ e });

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
                        <input className="form-control" defaultValue={currentOffice.name} disabled />
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
                        <input type="text" className="form-control" defaultValue={currentOffice.id} />
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
                                <h6 className="sub-heading fw-bold mb-3" id="tname">{keyMoment}</h6>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Key Moment</label>
                                    <select className="form-select" id="keymomentDropdown" onChange={setKeyMomentForTrigger}>
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
                                    <select className="form-select" id="triggertypeDropdown">
                                        <option value="">Select an option</option>
                                        <option>Email</option>
                                        <option>SMS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Type of Duration</label>
                                    <select className="form-select" id="durationtypeDropdown" onChange={onChangeOfDurationType}>
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
                                    <input type="text" className="form-control" id="participent1" />
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
                                    <input type="text" className="form-control" id="participent2" />
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
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineParticipent" />
                                        <label className="form-check-label mb-0" htmlFor="inlineParticipent" >Participent</label>
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
                                defaultActiveKey={selectedTab}
                                id="texte-tabs"
                                className="mb-3"
                                onSelect={handleTabSelect}
                            >
                                <Tab eventKey="french" title="French">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                            <DraftailEditor
                                                onSave={(raw) => {
                                                    convertTexteToHtml(raw)
                                                }}
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
                                            <button className="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="dutch" title="Dutch">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                            <DraftailEditor
                                                onSave={(raw) => {
                                                    convertTexteToHtml(raw)
                                                }}
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
                                            <button className="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="english" title="English">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 mb-3">
                                            <label>Texte</label>
                                            <DraftailEditor
                                                onSave={(raw) => {
                                                    convertTexteToHtml(raw)
                                                }}
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
                                            <button className="btn-site mt-3">View</button>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Link</label>
                                    <input type="text" className="form-control" id="surveyLink" defaultValue="https://survey.realadvice.be/TRIOR/?" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxAgent" defaultValue="Harold+Salm" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" htmlFor="checkboxAgent" >Agent</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxOffice" defaultValue="office" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" htmlFor="checkboxOffice" >Office</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxDob" defaultValue="07-15-1996" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" htmlFor="checkboxDob" >DOB</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="checkboxLanguage" defaultValue="du" onChange={generateSurveyLink} />
                                        <label className="form-check-label mb-0" htmlFor="checkboxLanguage" >Language</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="activateReminderOptions" id="activateReminder" defaultValue="option1" />
                                        <label className="form-check-label" htmlFor="activateReminder">Activate Reminder</label>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="btn-site" onClick={createNewSurveyEmail}>Create New Version of Email</button>
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