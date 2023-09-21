import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import "draftail/dist/draftail.css";
import { convertToRaw, convertFromRaw } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE, UNDO_ICON } from "draftail";
import { variables } from '../Variables';

export const EmailLayoutModal = (props) => {
    const { showModal, modalTitle, modalType, officeId, clientId, hideLayoutModal, layoutId, reloadLayoutsList } = props;

    const [layoutHtml, setLayoutHtml] = useState("");
    const [emailLayout, setEmailLayout] = useState("");
    //let emailLayout = "";

    const saveLayoutForOffice = async (e) => {
        let layoutName = document.getElementById("newLayoutName").value;

        if (layoutName == "") {
            alert("Enter layout name");
            return;
        }
        if (emailLayout == "") {
            alert("Layout shouldn't be empty");
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
                'Content-Type': 'application/json'
            }
        };

        // ASP.NET Core API endpoint with headers
        axios.post(url, JSON.stringify(_layout), config) 
            .then(response => {
                alert("Layout successfully saved.")
                reloadLayoutsList();
                hideLayoutModal();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const getLayoutById = async () => {

        const response = await fetch(variables.API_URL + 'Layout/GetLayoutById?layoutId=' + layoutId);
        const jsonData = await response.json();
        if (jsonData != null) {
            setLayoutHtml(jsonData);
        }
    }

    const exporterConfig = {
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

    const toHTML = (raw) => {
        raw ? setEmailLayout(convertToHTML(exporterConfig)(convertFromRaw(raw))) : "";
        console.log(emailLayout);
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
                                        <DraftailEditor
                                            onSave={(raw) => {
                                                toHTML(raw)
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
                                        />
                                    </div>

                                </div>
                            </div>
                            <div>
                                <button class="btn-site" onClick={saveLayoutForOffice}>Save</button>
                            </div>
                        </>
                        :
                        <div dangerouslySetInnerHTML={{ __html: layoutHtml.layoutDetail }} />
                }
            </Modal.Body>
        </Modal>
    );
}
