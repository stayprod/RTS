import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import SunEditor, { buttonList, height } from 'suneditor-react';
import { variables, editorButtons } from '../Variables';
import { UseAuthContext } from '../context/AuthContext';

export const EmailLayoutModal = (props) => {
    const { showModal, modalTitle, modalType, officeId, clientId, hideLayoutModal, layoutId, reloadLayoutsList } = props;

    const [layoutHtml, setLayoutHtml] = useState("");
    const [emailLayout, setEmailLayout] = useState("");
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
        let layoutName = document.getElementById("newLayoutName").value;

        if (layoutName == "") {
            alert("Enter layout name");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return;
        }
        if (emailLayout == "") {
            alert("Layout shouldn't be empty");
            e.target.removeAttribute("disabled");
            document.querySelector("body").style.cursor = "default";
            return;
        }
        let _layout = {
            layoutid: 0,
            officeid: +officeId,
            clientid: +clientId,
            layoutName: layoutName,
            layoutDetail: emailLayout
        }

        let url = variables.API_URL + `Layout/SaveOfficeLayout?`;

        const config = {
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        };

        // ASP.NET Core API endpoint with headers
        axios.post(url, JSON.stringify(_layout), config) 
            .then(response => {
                alert("Layout successfully saved.");
                e.target.removeAttribute("disabled");
                document.querySelector("body").style.cursor = "default";
                reloadLayoutsList();
                hideLayoutModal();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const getLayoutById = async () => {

        let url = variables.API_URL + 'Layout/GetLayoutById?layoutId=' + layoutId;

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
        setEmailLayout(content);
    }

    useEffect(() => {
        if (layoutId != "" && layoutId != 0 && layoutId != undefined) {
            getLayoutById();
        }
    }, [layoutId])

    return (
        <Modal className="new-layout-modal" id={modalType + "EmailLayoutModal"} show={showModal} onHide={hideLayoutModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    modalType == "new" ?
                        <>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Layout Name</label>
                                    <input type="text" id="newLayoutName" className="form-control" />
                                </div>
                                <div className="col-sm-12 col-md-12 mb-3">
                                    <label className="me-3">Layout</label>
                                    <div className="d-flex">
                                        <SunEditor
                                            onChange={handleLayoutEditorChange}
                                            setContents={layoutHtml}
                                            setOptions={{
                                                height: 200,
                                                buttonList: editorButtons
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div>
                                <button className="btn-site" onClick={saveLayoutForOffice}>Save</button>
                            </div>
                        </>
                        :
                        <div dangerouslySetInnerHTML={{ __html: layoutHtml.layoutDetail }} />
                }
            </Modal.Body>
        </Modal>
    );
}
