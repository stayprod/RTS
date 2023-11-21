import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SunEditor, { buttonList, height } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { UseAuthContext } from '../context/AuthContext';

import { useToken } from './tokenContext';
import { variables, editorButtons } from '../Variables';

import { EmailLayoutModal } from './EmailLayout';

const targetOptions = [
    { label: "Vendor", value: "1" },
    { label: "Lessor", value: "2" },
    { label: "Buyer", value: "3" },
    { label: "Tenant", value: "4" },
]

export const Trigger = (props) => {
    const token = useToken();
    const [triggerNameBuilder, setTriggerNameBuilder] = useState({ "default": "Trigger:" });
    const [finalTriggerName, setFinalTriggerName] = useState("Trigger:");
    const [whiseOfficeDetail, setWhiseOfficeDetail] = useState({});
    const [localOfficeDetail, setLocalOfficeDetail] = useState({});
    const [clientDetail, setClientDetail] = useState({});
    const [whiseOfficesList, setWhiseOfficesList] = useState({});
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selected, setSelected] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState([]);
    const [selectedLaytOutId, setSelectedLaytOutId] = useState(0);
    const [selectedLaytName, setSelectedLaytName] = useState("");
    const [officeLayout, setOfficeLayout] = useState({});
    const [showLayoutModal, setShowLayoutModal] = useState(false);
    const [layoutModalTitle, setLayoutModalTitle] = useState("");
    const [layoutModalType, setLayoutModalType] = useState("");
    const [officeId, setOfficeId] = useState(0);
    const [clientId, setClientId] = useState(0);
    const [selectedTab, setSelectedTab] = useState("english");
    const [emailTexteEnglish, setEmailTexteEnglish] = useState("");
    const [emailTexteFrench, setEmailTexteFrench] = useState("");
    const [emailTexteDutch, setEmailTexteDutch] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [triggerDetail, setTriggerDetail] = useState({});
    const [suveryLinkForEmail, setSuveryLinkForEmail] = useState(["https://survey.realadvice.be/", "", "/?"]);
    const [contactPreference, setContactPreference] = useState("all");
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    const location = useLocation();
    const navigate = useNavigate();

    const getNavigateState = (e) => {
        //selected office detail from whise
        setWhiseOfficeDetail(location.state.WhiseOffice);
        setLocalOfficeDetail(location.state.LocalOfficeDetail);
        setClientDetail(location.state.ClientDetail)
        setWhiseOfficesList(location.state.AllWhiseOffices)
        getListOfLayoutsByOffice(location.state.ClientDetail.localclient.client);

        if (location.state.TriggerDetail != undefined) {
            loadTriggerDetailInEdit(location.state.TriggerDetail);
        }
        else {
            //Bind saved survey Link on page load
            suveryLinkForEmail[1] = location.state.WhiseOffice.id;
            let link = [...suveryLinkForEmail];
            let html = link.map((item, i) => {
                if (i == 3) {
                    item = item.replace("&", "");
                    return item;
                }
                else {
                    return item;
                }
            }).join("");
            document.getElementById("inputSurveyLink").value = html;
        }

    }

    const getListOfLayoutsByOffice = async (_localclient) => {
        if (_localclient == undefined) {
            _localclient = location.state.ClientDetail.localclient.client;
        }
        const response = await fetch(variables.API_URL + 'Layout/GetLayoutsByClients?clientId=' + _localclient.clientid, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        });

        const jsonData = await response.json();
        if (jsonData != null) {
            setOfficeLayout(jsonData);
        }
    }

    //set trigger detail in form while editing a trigger
    const loadTriggerDetailInEdit = (trigger) => {

        setTriggerDetail(trigger);
        document.getElementById("keymomentDropdown").value = trigger.keyMoment;
        let momentIndex = document.getElementById("keymomentDropdown").selectedIndex;
        let momentText = document.getElementById("keymomentDropdown")[momentIndex].text;
        triggerNameBuilder["keymomentDropdown"] = momentText;

        document.getElementById("triggertypeDropdown").value = trigger.triggerType;
        let triggertypeIndex = document.getElementById("triggertypeDropdown").selectedIndex;
        let triggertypeText = document.getElementById("triggertypeDropdown")[triggertypeIndex].text;
        triggerNameBuilder["triggertypeDropdown"] = triggertypeText;

        document.getElementById("durationtypeDropdown").value = trigger.durationType;
        let durationtypeIndex = document.getElementById("durationtypeDropdown").selectedIndex;
        let durationtypeText = document.getElementById("durationtypeDropdown")[durationtypeIndex].text;
        triggerNameBuilder["durationtypeDropdown"] = durationtypeText;

        if (trigger.durationValue != "") {
            document.getElementById("durationValue").removeAttribute("disabled");
            document.getElementById("durationValue").value = trigger.durationValue;
            triggerNameBuilder["durationValue"] = "(" + trigger.durationValue + ")";
        }
        document.getElementById("participent1").value = trigger.targetParticipant1;
        let participantIndex = document.getElementById("participent1").selectedIndex;
        let participantText = document.getElementById("participent1")[participantIndex].text;
        triggerNameBuilder["participent1"] = participantText;

        populateSurveyLinkInEditMode(trigger.surveyLink)

        //populate trigger name from database and fill state to handle controls state
        setFinalTriggerName(trigger.triggerName);

        //setSelectedTarget(targets);
        setSelectedTab(trigger.language);

        const transactionType = document.getElementById("transactionType");
        const transactionStatus = document.getElementById("transactionStatus");

        transactionType.value = trigger.transactionType;
        transactionStatus.value = trigger.transactionStatus;

        setEmailTexteEnglish(trigger.texteEnglish);
        setEmailTexteFrench(trigger.texteFrench);
        setEmailTexteDutch(trigger.texteDutch);

        document.getElementById("texteEngSubject").value = trigger.englishSubject;
        document.getElementById("texteFrSubject").value = trigger.frenchSubject;
        document.getElementById("texteDuSubject").value = trigger.dutchSubject;

        if (trigger.contactPreference != '') {
            setContactPreference(trigger.contactPreference);
        }
    }

    const populateSurveyLinkInEditMode = (_link) => {

        //splitting survey link to mark checkboxes checked when opening trigger is in edit mode
        const splittedSurveyLink = _link.split("/");
        splittedSurveyLink[1] += "//";

        let firstPart = splittedSurveyLink[0] + splittedSurveyLink[1] + splittedSurveyLink[2] + "/";
        let secondPart = splittedSurveyLink[3];
        let thirdPart = "/?";
        let remainingString = splittedSurveyLink[4].replace("?", "");
        let initialLinkStateArray = [];
        Array.prototype.push.apply(initialLinkStateArray, [firstPart, secondPart, thirdPart]);

        let savedParams = remainingString.split("&");
        savedParams.forEach((item, i) => {
            initialLinkStateArray.push("&" + item);
        })

        if (remainingString.indexOf("agent") != -1) {
            document.getElementById("checkAgent").checked = true;
        }
        if (remainingString.indexOf("profile=buyer") != -1) {
            document.getElementById("checkBuyer").checked = true;
        }
        if (remainingString.indexOf("profile=tenant") != -1) {
            document.getElementById("checkTenant").checked = true;
        }
        if (remainingString.indexOf("name={n") != -1) {
            document.getElementById("checkName").checked = true;
        }
        if (remainingString.indexOf("Firstname={f") != -1) {
            document.getElementById("checkFirstname").checked = true;
        }
        if (remainingString.indexOf("language") != -1) {
            document.getElementById("checkLanguage").checked = true;
        }
        if (remainingString.indexOf("profile=vendor") != -1) {
            document.getElementById("checkVendor").checked = true;
        }
        if (remainingString.indexOf("zip") != -1) {
            document.getElementById("checkZip").checked = true;
        }
        if (remainingString.indexOf("lessorestimation") != -1) {
            document.getElementById("checkEstimation").checked = true;
        }
        if (remainingString.indexOf("email") != -1) {
            document.getElementById("checkEmail").checked = true;
        }
        if (remainingString.indexOf("country") != -1) {
            document.getElementById("checkCountry").checked = true;
        }
        if (remainingString.indexOf("npssatisfication") != -1) {
            document.getElementById("checkSatisfaction").checked = true;
        }
        if (remainingString.indexOf("officeID") != -1) {
            document.getElementById("checkOfficeid").checked = true;
        }
        if (remainingString.indexOf("loginOfficeID") != -1) {
            document.getElementById("checkLoginofficeid").checked = true;
        }
        if (remainingString.indexOf("contactID") != -1) {
            document.getElementById("checkContactid").checked = true;
        }
        if (remainingString.indexOf("profile=lessor") != -1) {
            document.getElementById("checkLessor").checked = true;
        }
        setSuveryLinkForEmail(initialLinkStateArray);

        document.getElementById("inputSurveyLink").value = _link;
    }

    const setNameForTrigger = (e) => {

        if (e.target.value != "") {

            if (e.target.style.borderColor == "red") {
                e.target.style.borderColor = "#ced4da";
            }
            let index = e.target.selectedIndex;
            let value = e.target[index].text;
            triggerNameBuilder[e.target.id] = value;

            let nameString = ""
            Object.keys(triggerNameBuilder).map(item => {
                nameString += triggerNameBuilder[item] + " ";
            })
            setFinalTriggerName(nameString);



            //unchecked survey link checkboxes dynamically when keymoment dropdown get changed
            let _existinglink = [...suveryLinkForEmail];
            let surveyLinkParametersArray = _existinglink.slice(0, 3);

            if (e.target.id != "keymomentDropdown") {
                return;
            }

            document.getElementById("checkAgent").checked = false;
            document.getElementById("checkBuyer").checked = false;
            document.getElementById("checkTenant").checked = false;
            document.getElementById("checkName").checked = false;
            document.getElementById("checkFirstname").checked = false;
            document.getElementById("checkLanguage").checked = false;
            document.getElementById("checkVendor").checked = false;
            document.getElementById("checkZip").checked = false;
            document.getElementById("checkEstimation").checked = false;
            document.getElementById("checkEmail").checked = false;
            document.getElementById("checkCountry").checked = false;
            document.getElementById("checkSatisfaction").checked = false;
            document.getElementById("checkOfficeid").checked = false;
            document.getElementById("checkLoginofficeid").checked = false;
            document.getElementById("checkContactid").checked = false;
            document.getElementById("checkLessor").checked = false;

            if (location.state.TriggerDetail != undefined && location.state.TriggerDetail.keyMoment == e.target.value) {
                populateSurveyLinkInEditMode(location.state.TriggerDetail.surveyLink);
                return
            }

            if (e.target.value == "1") {
                document.getElementById("checkName").checked = true;
                document.getElementById("checkBuyer").checked = true;
                document.getElementById("checkFirstname").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkName"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkBuyer"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkFirstname"), surveyLinkParametersArray);
            }
            if (e.target.value == "2") {
                document.getElementById("checkBuyer").checked = true;
                document.getElementById("checkName").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkBuyer"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkName"), surveyLinkParametersArray);
            }
            if (e.target.value == "3") {
                document.getElementById("checkOfficeid").checked = true;
                document.getElementById("checkContactid").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkOfficeid"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkContactid"), surveyLinkParametersArray);
            }
            if (e.target.value == "4") {
                document.getElementById("checkVendor").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkVendor"), surveyLinkParametersArray);
            }
            if (e.target.value == "5") {
                document.getElementById("checkEstimation").checked = true;
                document.getElementById("checkCountry").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkEstimation"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
            }
            if (e.target.value == "6") {
                document.getElementById("checkEstimation").checked = true;
                document.getElementById("checkSatisfaction").checked = true;
                document.getElementById("checkTenant").checked = true;
                document.getElementById("checkCountry").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkEstimation"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkSatisfaction"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkTenant"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
            }
            if (e.target.value == "7") {
                document.getElementById("checkZip").checked = true;
                document.getElementById("checkLanguage").checked = true;
                document.getElementById("checkLessor").checked = true;
                document.getElementById("checkCountry").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkZip"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkLanguage"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkLessor"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
            }
            if (e.target.value == "8") {
                document.getElementById("checkZip").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkZip"), surveyLinkParametersArray);
            }
            if (e.target.value == "9") {
                document.getElementById("checkEstimation").checked = true;
                document.getElementById("checkTenant").checked = true;
                document.getElementById("checkCountry").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkEstimation"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkTenant"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
            }
            if (e.target.value == "10") {
                document.getElementById("checkTenant").checked = true;
                document.getElementById("checkCountry").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkTenant"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
            }
            if (e.target.value == "11") {
                document.getElementById("checkZip").checked = true;
                document.getElementById("checkLanguage").checked = true;
                document.getElementById("checkLessor").checked = true;
                document.getElementById("checkCountry").checked = true;
                document.getElementById("checkFirstname").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkZip"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkLanguage"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkLessor"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkFirstname"), surveyLinkParametersArray);
            }
            if (e.target.value == "12") {
                document.getElementById("checkCountry").checked = true;
                document.getElementById("checkFirstname").checked = true;
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkCountry"), surveyLinkParametersArray);
                surveyLinkParametersArray = generateSurveyLinkOnKeyMomentDropdownChange(document.getElementById("checkFirstname"), surveyLinkParametersArray);
            }


            let finalSurveyLink = surveyLinkParametersArray.map((item, i) => {
                if (i == 3) {
                    item = item.replace("&", "");
                    return item;
                }
                else {
                    return item;
                }
            }).join("")

            document.getElementById("inputSurveyLink").value = finalSurveyLink;

            setSuveryLinkForEmail(current => surveyLinkParametersArray);
        }
        else {
            triggerNameBuilder[e.target.id] = "";
            let nameString = ""
            Object.keys(triggerNameBuilder).map(item => {
                nameString += triggerNameBuilder[item] + " ";
            })
            setFinalTriggerName(nameString);
        }



    }

    //push selected checkbox value in survey link parameter array and return updated array
    const generateSurveyLinkOnKeyMomentDropdownChange = (e, _linkArray) => {
        let checked = e.checked;
        let placeholder = e.getAttribute("placeholder");
        let paramName = e.getAttribute("parameter");

        let symbol = "&";

        if (checked == true) {
            let finalValue = symbol + paramName + "=" + placeholder;
            const existingParam = _linkArray.filter(item => {
                return item == finalValue;
            })
            if (existingParam.length == 0) {
                _linkArray.push(finalValue);
            }
        }
        else {
            let finalValue = symbol + paramName + "=" + placeholder;
            const indexOfItem = _linkArray.indexOf(finalValue);
            _linkArray.splice(indexOfItem, 1);
        }

        return _linkArray;
    }

    const resetConditionDropdowns = (e) => {
        let value = e.target.value;
        if (value != "") {
            if (e.target.style.borderColor == "red") {
                e.target.style.borderColor = "#ced4da";
            }
        }
    }

    const onChangeOfDurationType = (e) => {
        let value = e.target.value;
        if (value != "") {
            document.getElementById("durationValue").removeAttribute("disabled");

            if (e.target.style.borderColor == "red") {
                e.target.style.borderColor = "#ced4da";
            }

            let index = e.target.selectedIndex;
            let value = e.target[index].text;
            triggerNameBuilder[e.target.id] = value;

            let nameString = ""
            Object.keys(triggerNameBuilder).map(item => {
                nameString += triggerNameBuilder[item] + " ";
            })

            setFinalTriggerName(nameString);
        }
        else {
            document.getElementById("durationValue").value = "";
            document.getElementById("durationValue").setAttribute("disabled", true);

            triggerNameBuilder["durationValue"] = "";
            triggerNameBuilder[e.target.id] = "";

            let nameString = ""
            Object.keys(triggerNameBuilder).map(item => {
                nameString += triggerNameBuilder[item] + " ";
            })

            setFinalTriggerName(nameString);
        }
    }

    //const appendMultiselectValuesInTriggerName = (targets) => {

    //    if (targets.length > 0) {
    //        let targetString = "";
    //        targets.forEach(item => {
    //            targetString += item.label + " ";
    //        })
    //        triggerNameBuilder["ctarget1"] = targetString;
    //        let nameString = ""
    //        Object.keys(triggerNameBuilder).map(item => {
    //            nameString += triggerNameBuilder[item] + " ";
    //        })

    //        setFinalTriggerName(nameString);
    //    }
    //    else {
    //        triggerNameBuilder["ctarget1"] = "";
    //        let nameString = ""
    //        Object.keys(triggerNameBuilder).map(item => {
    //            nameString += triggerNameBuilder[item] + " ";
    //        })

    //        setFinalTriggerName(nameString);
    //    }

    //}

    //const setListOfTargetType = (e) => {

    //    setSelectedTarget(e);
    //    appendMultiselectValuesInTriggerName(e); //append selected c-targets in trigger name

    //    const _targers = e;

    //    _targers.forEach(traget => {
    //        if (participentType.indexOf(traget.value) == -1) {
    //            participentType.push(traget.label);
    //        }
    //    })

    //    let html = ""
    //    document.getElementById("surveyTypeCheckboxes").innerHTML = "";

    //    html += `<label class="me-3 mb-0 fw-bold">Survey Email:</label>`;
    //    html += `<div class="form-check form-check-inline me-2">
    //                <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineParticipent" />
    //                <label class="form-check-label mb-0" for="inlineParticipent" >Participent</label>
    //            </div>`

    //    participentType.forEach((item) => {
    //        html += `<div class="form-check form-check-inline me-2">
    //                    <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inline${item}" />
    //                    <label class="form-check-label mb-0" for="inline${item}" >${item}</label>
    //                </div>`
    //    })

    //    document.getElementById("surveyTypeCheckboxes").innerHTML += html;
    //}

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
            setOfficeId(localOfficeDetail.officeid);
            setClientId(clientDetail.localclient.client.clientid);
        }
        else {
            if (document.getElementById("layoutDropdown").value == "") {
                alert("No layout selected for preview");
                return
            }
            setShowLayoutModal(true);
            setLayoutModalTitle(selectedLaytName + " Layout Preview");
            setLayoutModalType("preview");
            setOfficeId(localOfficeDetail.officeid);
            setClientId(clientDetail.localclient.client.clientid);
        }
    }

    const handleTabSelect = (e) => {
        setSelectedTab(e);
    }

    const replaceTriorFromLink = (e) => {
        const value = e.target.value;
        const splitedValue = value.split("/");

        const triorReplacement = splitedValue[3];

        let link = [...suveryLinkForEmail];
        link[1] = triorReplacement;
        setSuveryLinkForEmail(current => link);
    }

    const generateSurveyLink = (e) => {
        let checked = e.target.checked;
        let placeholder = e.target.getAttribute("placeholder");
        let paramName = e.target.getAttribute("parameter");
        let link = [...suveryLinkForEmail];
        let symbol = "&";

        if (checked == true) {
            let finalValue = symbol + paramName + "=" + placeholder;
            const existingParam = link.filter(item => {
                return item == finalValue;
            })
            if (existingParam.length == 0) {
                link.push(finalValue);
            }
        }
        else {
            let finalValue = symbol + paramName + "=" + placeholder;
            const indexOfItem = link.indexOf(finalValue);
            link.splice(indexOfItem, 1);
        }

        let html = link.map((item, i) => {
            if (i == 3) {
                item = item.replace("&", "");
                return item;
            }
            else {
                return item;
            }
        }).join("")

        document.getElementById("inputSurveyLink").value = html;

        setSuveryLinkForEmail(current => link);
    }

    //const createNewSurveyEmail = (e) => {

    //}

    const saveTrigger = (e) => {
        e.target.setAttribute("disabled", true);
        document.querySelector("body").style.cursor = "progress";
        let isFRequiredFieldsEmpty = false;
        const keymomentDropdown = document.getElementById("keymomentDropdown");
        const triggerTypeDropdown = document.getElementById("triggertypeDropdown");
        const durationtypeDropdown = document.getElementById("durationtypeDropdown");
        const durationValue = document.getElementById("durationValue");
        const whiseOptions = document.getElementById("whiseAppointmentType");
        const transactionType = document.getElementById("transactionType");
        const transactionStatus = document.getElementById("transactionStatus");
        const englishSubject = document.getElementById("texteEngSubject");
        const frenchSubject = document.getElementById("texteFrSubject");
        const dutchSubject = document.getElementById("texteDuSubject");
        const targetParticipent = document.getElementById("participent1");

        if (keymomentDropdown.value == "") {
            keymomentDropdown.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        } // 
        if (triggerTypeDropdown.value == "") {
            triggerTypeDropdown.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (durationtypeDropdown.value == "") {
            durationtypeDropdown.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (durationValue.value == "") {
            durationValue.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (targetParticipent.value == "") {
            targetParticipent.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        if (whiseOptions.value == "") {
            whiseOptions.style.borderColor = "red";
            isFRequiredFieldsEmpty = true;
        }
        //if (transactionType.value == "") {
        //    transactionType.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}
        //if (transactionStatus.value == "") {
        //    transactionStatus.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}
        //if (englishSubject.value == "") {
        //    englishSubject.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}
        //if (frenchSubject.value == "") {
        //    frenchSubject.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}
        //if (dutchSubject.value == "") {
        //    dutchSubject.style.borderColor = "red";
        //    isFRequiredFieldsEmpty = true;
        //}

        if (isFRequiredFieldsEmpty == true) {
            alert("Please fill the required fields");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return
        }

        //configurations to post json data
        const jsonconfig = {
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        };

        //SaveOfficeTriggerDetail api call
        //Api call to save trigger for an office
        let language = selectedTab;
        let trigger = {};
        let objOfficeTrigger = {
            OfficeTriggerid: triggerDetail.officeTriggerid != undefined ? triggerDetail.officeTriggerid : 0,
            Officeid: +localOfficeDetail.officeid,
            WhiseOfficeid: whiseOfficeDetail.id,
            WhiseClientid: clientDetail.id,
            Layoutid: +selectedLaytOutId,
            TriggerName: finalTriggerName,
            KeyMoment: keymomentDropdown.value,
            TriggerType: triggerTypeDropdown.value,
            DurationType: durationtypeDropdown.value,
            DurationValue: +durationValue.value,
            TargetParticipant1: targetParticipent.value,
            CTarget1: JSON.stringify(selectedTarget), //document.getElementById("ctarget1").value,
            TargetParticipant2: "",
            CTarget2: "",
            Language: language,
            EnglishSubject: englishSubject.value,
            TexteEnglish: emailTexteEnglish,
            FrenchSubject: frenchSubject.value,
            TexteFrench: emailTexteFrench,
            DutchSubject: dutchSubject.value,
            TexteDutch: emailTexteDutch,
            AppointmentType: whiseOptions.value,
            TransactionType: transactionType.value,
            TransactionStatus: transactionStatus.value,
            SurveyLink: document.getElementById("inputSurveyLink").value,
            ContactPreference: contactPreference
        }
        let triggerurl = variables.API_URL + `OfficeTrigger/SaveOfficeTriggerDetail?`;
        return axios.post(triggerurl, JSON.stringify(objOfficeTrigger), jsonconfig)
            .then((response) => {
                alert("Trigger successfully saved.");
                e.target.removeAttribute("disabled");
                document.querySelector("body").style.cursor = "default";
                moveBackToOfficeScreen();
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
    }

    const moveBackToOfficeScreen = (e) => {
        const stateBuilder = {
            AllWhiseOffices: whiseOfficesList,
            WhiseOffice: whiseOfficeDetail,
            CurrentClient: clientDetail,
            LocalOffice: localOfficeDetail,
            LocalOfficesList: location.state.LocalOfficesList
        }

        const url = "/officesettings/" + whiseOfficeDetail.id;
        navigate(url, {
            state: stateBuilder
        });
    }

    const contactPreferenceChangeHandler = (e) => {
        const checkedOption = e.target.getAttribute("preferencevalue");
        setContactPreference(checkedOption);
    }

    const handleEditorChangeEnglish = (content) => {
        setEmailTexteEnglish(content);
    };

    const handleEditorChangeFrench = (content) => {
        setEmailTexteFrench(content);
    }

    const handleEditorChangeDutch = (content) => {
        setEmailTexteDutch(content);
    }

    useEffect(() => {

        if (location.state != null) {
            getNavigateState();
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

    useEffect(() => {
        if (location.state.TriggerDetail != undefined)
            document.getElementById("whiseAppointmentType").value = location.state.TriggerDetail.appointmentType;
    }, [data])

    useEffect(() => {
        if (location.state.TriggerDetail != undefined) {
            setSelectedLaytOutId(location.state.TriggerDetail.layoutid);
            document.getElementById("layoutDropdown").value = location.state.TriggerDetail.layoutid;
        }
    }, [officeLayout])

    useEffect(() => {
        document.title = 'Trigger - Real Advice Trigger System';
    }, []);

    return (
        <>
            <section className="client-setting">
                <div className="row py-3">
                    <div className="col-sm-12">
                        <h4 className="position-relative">
                            <span className="position-absolute back-arrow" onClick={moveBackToOfficeScreen}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </span>
                            Add Trigger
                        </h4>
                    </div>
                    <div className="col-sm-12">
                        <label className="me-2 fw-bold">Client:</label><span>{clientDetail.name}</span><br />
                        <label className="me-2 fw-bold">Office:</label><span>{whiseOfficeDetail.name}</span>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <h6 className="sub-heading fw-bold mb-3" id="tname">
                            {finalTriggerName}
                        </h6>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Key Moment</label>
                            <select className="form-select" id="keymomentDropdown" onChange={setNameForTrigger}>
                                <option value="" key="">Select an option</option>
                                <option value="1" key="1">Evaluation (to sale)</option>
                                <option value="2" key="2">Evaluation (to rent)</option>
                                <option value="3" key="3">After mandate (to sale)</option>
                                <option value="4" key="4">After mandate (to rent)</option>
                                <option value="5" key="5">Visits (to sale)</option>
                                <option value="6" key="6">Visits (to rent)</option>
                                <option value="7" key="7">Sale agreement</option>
                                <option value="8" key="8">Rental agreement</option>
                                <option value="9" key="9">Notarial deed</option>
                                <option value="10" key="10">Entry inventory</option>
                                <option value="11" key="11">Exit inventory</option>
                            </select>
                        </div>
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Trigger Type</label>
                            <select className="form-select" id="triggertypeDropdown" onChange={setNameForTrigger}>
                                <option value="">Select an option</option>
                                <option value="1">Email</option>
                                <option value="2">SMS</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Type of Duration</label>
                            <select className="form-select" id="durationtypeDropdown" onChange={onChangeOfDurationType}>
                                <option value="">Select an option</option>
                                <option value="1">Days</option>
                                <option value="2">Hours</option>
                                <option value="3">Minutes</option>
                            </select>
                        </div>
                        <div className="col-sm-12 col-md-2 mb-3">
                            <label>Value</label>
                            <input
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === '-')
                                        e.preventDefault()


                                }}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    if (e.target.style.borderColor == "red") {
                                        e.target.style.borderColor = "#ced4da";
                                    }

                                    triggerNameBuilder[e.target.id] = "(" + value + ")";

                                    let nameString = ""
                                    Object.keys(triggerNameBuilder).map(item => {
                                        nameString += triggerNameBuilder[item] + " ";
                                    })

                                    setFinalTriggerName(nameString);
                                }}
                                className="form-control"
                                id="durationValue"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Target</label>
                            <select className="form-select" id="participent1" onChange={setNameForTrigger}>
                                <option value="">Select an option</option>
                                <option value="1">Participant</option>
                                <option value="2">No Participant</option>
                            </select>
                        </div>
                        {/*<div className="col-sm-12 col-md-4 mb-3">*/}
                        {/*    <label>C-Target</label>*/}
                        {/*    <MultiSelect*/}
                        {/*        className="multiselect"*/}
                        {/*        options={targetOptions}*/}
                        {/*        value={selectedTarget}*/}
                        {/*        onChange={setListOfTargetType}*/}
                        {/*        labelledBy="target"*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div>
                        <h6 className="sub-heading fw-bold mb-3">Condition:</h6>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>WHISE</label>
                            <select className="form-select" id="whiseAppointmentType" onChange={resetConditionDropdowns}>
                                <option value="">Select an option</option>
                                {data?.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}({option.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Property Transaction Type</label>
                            <select className="form-select" id="transactionType" onChange={resetConditionDropdowns}>
                                <option value="">Select an option</option>
                                <option value="1">To sale</option>
                                <option value="2">To rent</option>
                                <option value="3">Annuity sale</option>
                            </select>
                        </div>
                        <div className="col-sm-12 col-md-4 mb-3">
                            <label>Property Transaction Status</label>
                            <select className="form-select" id="transactionStatus" onChange={resetConditionDropdowns}>
                                <option value="">Select an option</option>
                                <option value="1">To sale</option>
                                <option value="2">To rent</option>
                                <option value="3">Sold</option>
                                <option value="4">Rented</option>
                                <option value="5">Under option (sale)</option>
                                <option value="6">Under option rent</option>
                                <option value="7">Retiré de la vente</option>
                                <option value="8">Retiré de la Location</option>
                                <option value="9">Suspendu vendu</option>
                                <option value="10">Suspendu loué</option>
                                <option value="11">Option prop. Vendu</option>
                                <option value="12">Option prop. Loué</option>
                                <option value="13">Vendu avec cond. suspensive</option>
                                <option value="14">A vendre en viager</option>
                                <option value="15">Sous option en viager</option>
                                <option value="16">Vendu en viager</option>
                                <option value="17">Prospection</option>
                                <option value="18">Préparation vente</option>
                                <option value="19">Réservé</option>
                                <option value="20">Compromis</option>
                                <option value="21">Prospection location</option>
                                <option value="22">Estimation vente</option>
                                <option value="23">Estimation location</option>
                                <option value="24">Estimation rente viagère</option>
                                <option value="25">Préparation location</option>
                                <option value="26">Préparation vente en viager</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h6 className="sub-heading fw-bold mb-3">Select Email Configuration:</h6>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                            <label className="me-3 mb-0 fw-bold">Survey Email:</label>
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
                        <Tab eventKey="english" title="English">
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Subject</label>
                                    <input type="text" className="form-control" id="texteEngSubject" onInput={resetConditionDropdowns} />
                                </div>
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label>Texte</label>
                                    <SunEditor
                                        onChange={handleEditorChangeEnglish}
                                        setContents={emailTexteEnglish}
                                        setOptions={{
                                            height: 200,
                                            buttonList: editorButtons
                                        }}
                                    />
                                    {/*<button className="btn-site mt-3">View</button>*/}
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="french" title="French">
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Subject</label>
                                    <input type="text" className="form-control" id="texteFrSubject" onInput={resetConditionDropdowns} />
                                </div>
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label>Texte</label>
                                    <SunEditor
                                        onChange={handleEditorChangeFrench}
                                        setContents={emailTexteFrench}
                                        setOptions={{
                                            height: 200,
                                            buttonList: editorButtons
                                        }}
                                    />
                                    <button className="btn-site mt-3">View</button>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="dutch" title="Dutch">
                            <div className="row">
                                <div className="col-sm-12 col-md-4 mb-3">
                                    <label>Subject</label>
                                    <input type="text" className="form-control" id="texteDuSubject" onInput={resetConditionDropdowns} />
                                </div>
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label>Texte</label>
                                    <SunEditor
                                        onChange={handleEditorChangeDutch}
                                        setContents={emailTexteDutch}
                                        setOptions={{
                                            height: 200,
                                            buttonList: editorButtons
                                        }}
                                    />
                                    <button className="btn-site mt-3">View</button>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                            <label className="me-3">Link</label>
                            <textarea className="form-control" rows="3" id="inputSurveyLink" onChange={replaceTriorFromLink}></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 mb-3">
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkAgent" parameter="agent" placeholder="{agent}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkAgent" >Agent</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkName" parameter="name" placeholder="{name}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkName" >Name</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkFirstname" parameter="Firstname" placeholder="{firstName}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkFirstname" >Firstname</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkLanguage" parameter="language" placeholder="{language}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkLanguage" >Language</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkZip" parameter="zip" placeholder="{zip}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkZip"  >Zip</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkEmail" parameter="email" placeholder="{email}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkEmail" >Email</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkCountry" parameter="country" placeholder="{country}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkCountry" >Country</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkOfficeid" parameter="officeID" placeholder="{officeid}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkOfficeid" >OfficeID</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkLoginofficeid" parameter="loginOfficeID" placeholder="{loginofficeid}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkLoginofficeid" >LoginOfficeID</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkContactid" parameter="contactID" placeholder="{contactid}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkContactid" >ContactID</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkLessor" parameter="profile" placeholder="lessor" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkLessor" >Profile=Lessor</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkBuyer" parameter="profile" placeholder="buyer" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkBuyer" >Profile=Buyer</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkTenant" parameter="profile" placeholder="tenant" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkTenant" >Profile=Tenant</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkVendor" parameter="profile" placeholder="vendor" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkVendor" >Profile=Vendor</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkEstimation" parameter="lessorestimation" placeholder="{lessorestimation}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkEstimation" >LessorEstimation</label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="checkbox" id="checkSatisfaction" parameter="npssatisfication" placeholder="{npssatisfication}" onChange={generateSurveyLink} />
                                <label className="form-check-label mb-0" htmlFor="checkSatisfaction" >NPSSatisfication</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h6 className="sub-heading fw-bold mb-3">Preferences:</h6>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="radio" name="preferenceRadio" id="checkAllEmail"
                                    preferencevalue="all" onChange={contactPreferenceChangeHandler} checked={contactPreference == "all"} />
                                <label className="form-check-label" htmlFor="checkAllEmail">
                                    Send mail to all contact's email
                                </label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="radio" name="preferenceRadio" id="checkPrivateEamil"
                                    preferencevalue="private" onChange={contactPreferenceChangeHandler} checked={contactPreference == "private"} />
                                <label className="form-check-label" htmlFor="checkPrivateEamil">
                                    Private email only
                                </label>
                            </div>
                            <div className="form-check form-check-inline me-4">
                                <input className="form-check-input" type="radio" name="preferenceRadio" id="checkBusinessEamil"
                                    preferencevalue="business" onChange={contactPreferenceChangeHandler} checked={contactPreference == "business"} />
                                <label className="form-check-label" htmlFor="checkBusinessEamil">
                                    Business email
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button className="btn-site me-2" onClick={saveTrigger}>Save Trigger</button>{/*<button className="btn-site" onClick={createNewSurveyEmail}>Create New Version of Email</button>*/}
                    </div>
                </div>
            </section>
        </>
    )
}