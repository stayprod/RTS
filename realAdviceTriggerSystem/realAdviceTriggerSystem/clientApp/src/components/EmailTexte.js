import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import SunEditor, { buttonList, height } from 'suneditor-react';
import { variables, editorButtons } from '../Variables';
import { UseAuthContext } from '../context/AuthContext';

export const EamilTexteModal = (props) => {
    const { showModalTexte, modalTitleTexte, modalType, officeId, clientId, hideLayoutModalTexte, TexteLayoutId, reloadLayoutsList } = props;

    const [layoutHtml, setLayoutHtml] = useState("");
    const [emailLayout, setEmailLayout] = useState("");
    const [selectedTab, setSelectedTab] = useState("english");
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();
    //let emailLayout = "";



    const saveLayoutForOffice = async (e) => {
        e.target.setAttribute("disabled", true);
        document.querySelector("body").style.cursor = "progress";
        let texteTemplateName = document.getElementById("newTexteTemplateName").value;
        let texteEnglishSubject = document.getElementById("texteEnglishSubject").value;
        let texteEnglishArea = document.getElementById("texteEnglishArea").value;
        let texteFrenchSubject = document.getElementById("texteFrenchSubject").value;
        let texteFrenchArea = document.getElementById("texteFrenchArea").value;
        let texteDutchSubject = document.getElementById("texteDutchSubject").value;
        let texteDutchArea = document.getElementById("texteDutchArea").value


        if (texteTemplateName == "") {
            alert("Enter Texte Template Name");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return;
        }

        if (texteEnglishSubject == "") {
            alert("Enter English Subject Texte ");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return;
        }

        if (texteEnglishArea == "") {
            alert("Enter English Texte Details  ");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return;
        }

        //if (emailLayout == "") {
        //    alert("Texte Template shouldn't be empty");
        //    e.target.removeAttribute("disabled");
        //    document.querySelector("body").style.cursor = "default";
        //    return;
        //}

        let texteTemplate = {
            TemplateId: 0,
            CreatedbyOfficeId: +officeId,
            CreatedbyClientId: +clientId,
            TemplateName: texteTemplateName,
            EnglishSubject: texteEnglishSubject,
            EnglishTexte: texteEnglishArea,
            FrenchSubject: texteFrenchSubject,
            FrenchTexte: texteFrenchArea,
            DutchSubject: texteDutchSubject,
            DutchTexte: texteDutchArea,
        }

        let url = variables.API_URL + `TexteTemplate/SaveTexteTemplate?`;

        const config = {
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        };

        // ASP.NET Core API endpoint with headers
        axios.post(url, JSON.stringify(texteTemplate), config)
            .then(response => {
                alert("Texte Template successfully saved.");
                e.target.removeAttribute("disabled");
                document.querySelector("body").style.cursor = "default";
                reloadLayoutsList();
                hideLayoutModalTexte();
                setEmailLayout("");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }

    const getLayoutById = async () => {

        let url = variables.API_URL + 'TexteTemplate/GetTexteTemplateById?templateId=' + TexteLayoutId;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        });

        const jsonData = await response.json();
        if (jsonData != null) {
            setLayoutHtml(jsonData);
        }
    }

    const handleLayoutEditorChange = (content) => {
        setEmailLayout(content.target.value);
    }

    useEffect(() => {
        if (TexteLayoutId != "" && TexteLayoutId != 0 && TexteLayoutId != undefined) {
            getLayoutById();
        }
    }, [TexteLayoutId])

    const resetConditionDropdowns = (e) => {
        let value = e.target.value;
        if (value != "") {
            if (e.target.style.borderColor == "red") {
                e.target.style.borderColor = "#ced4da";
            }
        }
    }
    const handleTabSelect = (e) => {
        setSelectedTab(e);
    }

    return (
        <Modal className="new-layout-modal" id={modalType + "EmailLayoutModal"} show={showModalTexte} onHide={hideLayoutModalTexte}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitleTexte}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    modalType == "new" ?
                        <>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Texte Name</label>
                                    <input type="text" id="newTexteTemplateName" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Texte Details</label>
                                    <div className="">
                                        {/*<SunEditor*/}
                                        {/*    onChange={handleLayoutEditorChange}*/}
                                        {/*    setContents={layoutHtml}*/}
                                        {/*    setOptions={{*/}
                                        {/*        height: 200,*/}
                                        {/*        buttonList: editorButtons*/}
                                        {/*    }}*/}
                                        {/*/>*/}
                                        <Tabs
                                            defaultActiveKey={selectedTab}
                                            id="texte-tabs"
                                            className="mb-3"
                                            onSelect={handleTabSelect}
                                        >
                                            <Tab eventKey="english" title="English">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label htmlFor="texteEnglishSubject" className="form-label">Subject</label>
                                                        <input type="text" className="form-control" id="texteEnglishSubject" />
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte</label>
                                                        <div className="d-flex">
                                                            <textarea className="form-control h-100" rows="10" id="texteEnglishArea" onChange={handleLayoutEditorChange} >
                                                            </textarea>
                                                        </div>

                                                        <button className="btn-site mt-3" onClick={saveLayoutForOffice}>Save</button>
                                                    </div>

                                                </div>
                                            </Tab>
                                            <Tab eventKey="french" title="French">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label>Subject</label>
                                                        <input type="text" className="form-control" id="texteFrenchSubject" onInput={resetConditionDropdowns} />
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte</label>
                                                        <div className="d-flex">
                                                            <textarea className="form-control h-100" rows="10" id="texteFrenchArea" onChange={handleLayoutEditorChange} >
                                                            </textarea>
                                                        </div>
                                                        <button className="btn-site mt-3" onClick={saveLayoutForOffice}>Save</button>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="dutch" title="Dutch">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label>Subject</label>
                                                        <input type="text" className="form-control" id="texteDutchSubject" onInput={resetConditionDropdowns} />
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte </label>

                                                        <div className="d-flex">
                                                            <textarea className="form-control h-100" rows="10" id="texteDutchArea" onChange={handleLayoutEditorChange} >
                                                            </textarea>
                                                        </div>
                                                        <button className="btn-site mt-3" onClick={saveLayoutForOffice}>Save</button>
                                                    </div>


                                                </div>
                                            </Tab>
                                        </Tabs>
                                        {/*<textarea className="form-control h-100" value={emailLayout} rows="15" id="textAreaEmailLayout" onChange={handleLayoutEditorChange} >*/}
                                        {/*</textarea>*/}
                                    </div>

                                </div>
                            </div>
                          
                        </>
                        :

                         <div className="row">
                                {/*<div className="col-sm-12 col-md-12 mb-3">*/}
                                {/*    <label className="me-3">Texte Name</label>*/}
                                {/*<div dangerouslySetInnerHTML={{ __html: layoutHtml.englishSubject }} />*/}
                                {/*</div>*/}
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3 mb-2">Texte Details</label>
                                    <div className="">
                                       
                                        <Tabs
                                            defaultActiveKey={selectedTab}
                                            id="texte-tabs"
                                            className="mb-3"
                                            onSelect={handleTabSelect}
                                        >
                                            <Tab eventKey="english" title="English">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label htmlFor="texteEnglishSubject" className="form-label">Subject :</label>
                                                    <div dangerouslySetInnerHTML={{ __html: layoutHtml.englishSubject }} />
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte :</label>
                                                        <div className="d-flex">
                                                        <div dangerouslySetInnerHTML={{ __html: layoutHtml.englishTexte }} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </Tab>
                                            <Tab eventKey="french" title="French">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label>Subject :</label>
                                                    <div dangerouslySetInnerHTML={{ __html: layoutHtml.frenchSubject }} />

                                                    </div>
                                                <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte :</label>
                                                        <div className="d-flex">
                                                        <div dangerouslySetInnerHTML={{ __html: layoutHtml.frenchTexte }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="dutch" title="Dutch">
                                                <div className="row">
                                                    <div className="mb-3">
                                                        <label>Subject :</label>
                                                    <div dangerouslySetInnerHTML={{ __html: layoutHtml.dutchSubject}} />
                                                    </div>

                                                    <div className="col-sm-12 col-md-12 mb-3">
                                                        <label>Texte :</label>

                                                        <div className="d-flex">
                                                        <div dangerouslySetInnerHTML={{ __html: layoutHtml.dutchTexte}} />
                                                        </div>
                                                    </div>


                                                </div>
                                            </Tab>
                                        </Tabs>
                                    
                                    </div>

                                </div>
                            </div>

                        
                }
            </Modal.Body>
        </Modal>
    );
}
