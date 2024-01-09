import React, { Component, useEffect, useState } from 'react';
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { variables, editorButtons } from '../Variables';
import axios from 'axios';
import { UseAuthContext } from '../context/AuthContext';


export const DeleteConfirmationModal = (props) => {

    const { showModelDelete, deleteModalTitle, deleteModalType, hideModalDelete, itemId, itemName,
        dropdownItemsList, client, office, reloadSelectedItemDropdown, updateDropdownStatesAfterDelete, triggerDetail } = props;

    const [triggersListByItemId, setTriggersListByItemId] = useState([]);
    const [isLayoutInUsed, setIsLayoutInUsed] = useState(false);
    const [updatedItemIdForCurrentTrigger, setUpdatedItemIdForCurrentTrigger] = useState(0);
    const [updatedItemNameForCurrentTrigger, setUpdatedItemNameForCurrentTrigger] = useState("");
    const [modalClass, setModalClass] = useState("confirmation-delete-modal-small");

    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    const deleteLayoutOnConfirm = () => {
        const jsonconfig = {
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        };
        let url = variables.API_URL + `Layout/DeleteLayout?layoutId=` + itemId;
        axios.delete(url, jsonconfig)
            .then((response) => {
                if (response.data == "Layout successfully deleted.") {
                    alert("Layout Successfully Delete.");
                    hideModalDelete();
                    setIsLayoutInUsed(false);
                    setTriggersListByItemId([]);
                    setModalClass("confirmation-delete-modal-small");
                    reloadSelectedItemDropdown();
                    updateDropdownStatesAfterDelete(updatedItemIdForCurrentTrigger);
                }
                else {
                    setTriggersListByItemId(response.data);
                    setIsLayoutInUsed(true);
                }
            })
            .catch(error => {
                alert('Error fetching data:', error);
            });
    }

    const DeleteLayout = async () => {

        if (isLayoutInUsed == false) {
            deleteLayoutOnConfirm();
        }
        else {
            let isDropdownEmpty = false;
            let updatedTriggersList = [];
            triggersListByItemId.forEach(item => {
                let elementId = "layoutsDropdown" + item.officeTriggerid;
                if (document.getElementById(elementId).value == "") {
                    document.getElementById(elementId).style.borderColor = "red";
                    isDropdownEmpty = true;
                    return;
                }
                item.layoutid = document.getElementById(elementId).value;
                updatedTriggersList.push(item);
            })
            if (isDropdownEmpty == true) {
                return;
            }
            const jsonconfig = {
                headers: {
                    'Authorization': `Bearer ${authUser.tokenValue}`,
                    'Content-Type': 'application/json'
                }
            };
            let url = variables.API_URL + `OfficeTrigger/UpdateTriggersLayout?`;
            axios.post(url, JSON.stringify(updatedTriggersList), jsonconfig)
                .then(response => {
                    if (response.data == "Triggers layout updated successfully") {
                        deleteLayoutOnConfirm();
                    }
                })
                .catch(error => {
                    alert('Error fetching data:', error);
                });
        }

    }

    const onChangeHandlerDeleteModalLayoutDropdown = (e) => {
        if (e.target.value != "") {
            e.target.style.borderColor = "#ced4da";
            if (triggerDetail != null && e.target.getAttribute("triggerid") == triggerDetail.officeTriggerid) {
                setUpdatedItemIdForCurrentTrigger(+e.target.value);
                var index = e.target.selectedIndex;
                setUpdatedItemNameForCurrentTrigger(e.target[index].text);
            }
        }
    }

    // Delete Api Call Abdul Saboor
    const deleteTexteOnConfirm = () => {

        const jsonconfig = {
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        };

        let url = variables.API_URL + `TexteTemplate/DeleteTexteTemplate?templateId=` + itemId;

        axios.delete(url, jsonconfig)
            .then((response) => {
                if (response.data == "Texte template successfully deleted.") {
                    alert("Texte template successfully deleted");
                    hideModalDelete();
                    setIsLayoutInUsed(false);
                    setTriggersListByItemId([]);
                    setModalClass("confirmation-delete-modal-small");
                    reloadSelectedItemDropdown();
                    updateDropdownStatesAfterDelete(updatedItemIdForCurrentTrigger);

                } else {
                    setTriggersListByItemId(response.data);
                    setIsLayoutInUsed(true);
                }
            }).catch(error => {
                alert('Error fetching data:', error);
            });

    }

    // Update Api Call Abdul Saboor
    const DeleteTexte = async () => {

        if (isLayoutInUsed == false) {
            deleteTexteOnConfirm();
        }
        else {
            let isDropdownEmpty = false;
            let updatedTriggersList = [];
            triggersListByItemId.forEach(item => {
                let elementId = "texteDropdown" + item.officeTriggerid;
                if (document.getElementById(elementId).value == "") {
                    document.getElementById(elementId).style.borderColor = "red";
                    isDropdownEmpty = true;
                    return;
                }
                item.texteTemplateId = document.getElementById(elementId).value;
                updatedTriggersList.push(item);
           
            })
            if (isDropdownEmpty == true) {
                return;
            }

            const jsonconfig = {
                headers: {
                    'Authorization': `Bearer ${authUser.tokenValue}`,
                    'Content-Type': 'application/json'
                }
            };

            let url = variables.API_URL + `OfficeTrigger/UpdateTriggersTexteTemplate?`;
            axios.post(url, JSON.stringify(updatedTriggersList), jsonconfig)
                .then(response => {
                    if (response.data == "Triggers texte template updated successfully") {
                        deleteTexteOnConfirm();
                    }
                })
                .catch(error => {
                    alert('Error fetching data:', error);
                });
           /* setModalClass("confirmation-delete-modal-small");*/
        }
      
    }

    const onChangeHandlerDeleteModalTexteDropdown = (e) => {
        if (e.target.value != "") {
            e.target.style.borderColor = "#ced4da";
            if (triggerDetail != null && e.target.getAttribute("triggerid") == triggerDetail.officeTriggerid) {
                setUpdatedItemIdForCurrentTrigger(+e.target.value);
                var index = e.target.selectedIndex;
                setUpdatedItemNameForCurrentTrigger(e.target[index].text);
            }
        }
    }

    const hideModalAndClearTriggers = () => {
        hideModalDelete();
        setIsLayoutInUsed(false);
        setTriggersListByItemId([]);
        setModalClass("confirmation-delete-modal-small");
    }

    useEffect(() => {
        if (triggersListByItemId.length > 0) {
            setModalClass("confirmation-delete-modal-large");
        }
    }, [triggersListByItemId])

    return (
        <Modal className={modalClass} show={showModelDelete} onHide={hideModalAndClearTriggers}>
            <Modal.Header closeButton>
                <Modal.Title>{deleteModalTitle}</Modal.Title>
            </Modal.Header>
            {
                deleteModalType == "deletelayout" ?
                    <>
                        <Modal.Body>
                            <div>
                                {
                                    triggersListByItemId.length > 0 ?
                                        <>
                                            {
                                                triggersListByItemId.length > 1 ?
                                                    <h6 className="mb-4"> The "layout" you are trying to delete is used in the following triggers, please assign any other "layout" before confirming:</h6>
                                                    :
                                                    <h6 className="mb-4"> The "layout" you are trying to delete is used in the following trigger, please assign any other "layout" before confirming:</h6>
                                            }
                                            <div className="py-3 m-0-auto">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className="px-1 col-1 py-1 border">Client</th>
                                                            <th className="px-1 col-2 py-1 border">Office</th>
                                                            <th className="px-1 col-3 py-1 border">Trigger Name</th>
                                                            <th className="px-1 col-2 py-1 border">Used Layout</th>
                                                            <th className="px-1 col-2 py-1 border">Action</th>
                                                            <th className="px-1 col-2 py-1 border">Choose Layout</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            triggersListByItemId.map(item => {
                                                                return (<tr key={item.officeTriggerid}>
                                                                    <td className="px-1 py-1 border">{client.name}</td>
                                                                    <td className="px-1 py-1 border">{office.commercialName}</td>
                                                                    <td className="px-1 py-1 border">{item.triggerName}</td>
                                                                    <td className="px-1 py-1 border">{itemName}</td>
                                                                    <td className="px-1 py-1 border">Replace with</td>
                                                                    <td className="px-1 py-1 border layoutFormSelect"  >
                                                                        <select className="form-select" id={"layoutsDropdown" + item.officeTriggerid} triggerid={item.officeTriggerid} onChange={onChangeHandlerDeleteModalLayoutDropdown}>
                                                                            <option value="">Select Layout</option>
                                                                            {
                                                                                dropdownItemsList.length > 0 ? dropdownItemsList.map((d) => {
                                                                                    return (
                                                                                        <option key={d.layoutid} value={d.layoutid}>{d.layoutName}</option>
                                                                                    )
                                                                                })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                        :
                                        <h6 className="texteConfirmHeading">Are you sure you want to delete this Layout?</h6>
                                }

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={hideModalAndClearTriggers} >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={DeleteLayout}  >
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </>
                    :
                    <>
                        <Modal.Body>
                            <div>
                                {
                                    triggersListByItemId.length > 0 ?
                                        <>
                                            {
                                                triggersListByItemId.length > 1 ?
                                                    <h6 className="mb-4"> The "texte template" you are trying to delete is used in the following triggers, please assign any other "texte template" before confirming: </h6>
                                                    :
                                                    <h6 className="mb-4"> The "texte template" you are trying to delete is used in the following trigger, please assign any other "texte template" before confirming: </h6>

                                            }  
                                            <div className="py-3 m-0-auto">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className="px-1 col-1 py-1 border">Client</th>
                                                            <th className="px-1 col-2 py-1 border">Office</th>
                                                            <th className="px-1 col-3 py-1 border">Trigger Name</th>
                                                            <th className="px-1 col-2 py-1 border">Used Texte</th>
                                                            <th className="px-1 col-2 py-1 border">Action</th>
                                                            <th className="px-1 col-2 py-1 border">Choose Texte</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            triggersListByItemId.map(item => {
                                                                return (<tr key={item.officeTriggerid}>
                                                                    <td className="px-1 py-1 border">{client.name}</td>
                                                                    <td className="px-1 py-1 border">{office.commercialName}</td>
                                                                    <td className="px-1 py-1 border">{item.triggerName}</td>
                                                                    <td className="px-1 py-1 border">{itemName}</td>
                                                                    <td className="px-1 py-1 border">Replace with</td>
                                                                    <td className="px-1 py-1 border texteFormSelect">
                                                                        <select className="form-select" id={"texteDropdown" + item.officeTriggerid} triggerid={item.officeTriggerid} onChange={onChangeHandlerDeleteModalTexteDropdown}>
                                                                            <option value="">Select Texte</option>
                                                                            {
                                                                                dropdownItemsList.length > 0 ? dropdownItemsList.map((d) => {
                                                                                    return (
                                                                                        <option key={d.templateId} value={d.templateId}>{d.templateName}</option>
                                                                                    )
                                                                                })
                                                                                    :
                                                                                    ""
                                                                            }
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                        :
                                        <h6 className="texteConfirmHeading">Are you sure you want to delete this Texte?</h6>
                                }

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={hideModalAndClearTriggers} >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={DeleteTexte}  >
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </>
            }
        </Modal>
    )

    //return (

    //    <Modal className="confirmation-delete-modal" show={showModelDelete} onHide={hideModalAndClearTriggers}>
    //        <Modal.Header closeButton>
    //            <Modal.Title>{deleteModalTitle}</Modal.Title>
    //        </Modal.Header>
    //        {
    //            deleteModalType == "deletelayout" ?
    //                <>
    //                    <Modal.Body>
    //                        <div>
    //                            {
    //                                triggersListByItemId.length > 0 ?
    //                                    <>
    //                                        <h6 className="mb-4">The layout you trying to delete is used on the following trigger, please assign new layout before confirming:</h6>
    //                                        <div className="py-3 m-0-auto">
    //                                            <table>
    //                                                <thead>
    //                                                    <tr>
    //                                                        <th className="px-1 col-1 py-1 border">Client</th>
    //                                                        <th className="px-1 col-2 py-1 border">Office</th>
    //                                                        <th className="px-1 col-3 py-1 border">Trigger Name</th>
    //                                                        <th className="px-1 col-2 py-1 border">Used Layout</th>
    //                                                        <th className="px-1 col-2 py-1 border">Action</th>
    //                                                        <th className="px-1 col-2 py-1 border">Choose Layout</th>
    //                                                    </tr>
    //                                                </thead>
    //                                                <tbody>
    //                                                    {
    //                                                        triggersListByItemId.map(item => {
    //                                                            return (<tr>
    //                                                                <td className="px-1 py-1 border">{client.name}</td>
    //                                                                <td className="px-1 py-1 border">{office.commercialName}</td>
    //                                                                <td className="px-1 py-1 border">{item.triggerName}</td>
    //                                                                <td className="px-1 py-1 border">{itemName}</td>
    //                                                                <td className="px-1 py-1 border">Replace with</td>
    //                                                                <td className="px-1 py-1 border">
    //                                                                    <select className="form-select" id={"layoutsDropdown" + item.officeTriggerid} triggerid={item.officeTriggerid} onChange={onChangeHandlerDeleteModalLayoutDropdown}>
    //                                                                        <option value="">Select Layou</option>
    //                                                                        {
    //                                                                            dropdownItemsList.length > 0 ? dropdownItemsList.map((d) => {
    //                                                                                return (
    //                                                                                    <option value={d.layoutid}>{d.layoutName}</option>
    //                                                                                )
    //                                                                            })
    //                                                                                :
    //                                                                                ""
    //                                                                        }
    //                                                                    </select>
    //                                                                </td>
    //                                                            </tr>
    //                                                            )
    //                                                        })
    //                                                    }
    //                                                </tbody>
    //                                            </table>
    //                                        </div>
    //                                    </>
    //                                    :
    //                                    <h6>Are you sure you want to delete this Layout?</h6>
    //                            }

    //                        </div>
    //                    </Modal.Body>

    //                    <Modal.Footer>
    //                        <Button variant="default" onClick={hideModalAndClearTriggers} >
    //                            Cancel
    //                        </Button>
    //                        <Button variant="danger" onClick={DeleteLayout}  >
    //                            Confirm
    //                        </Button>
    //                    </Modal.Footer>

    //                </>
    //                :
    //                <>
    //                    <Modal.Body>
    //                        <div className="row">
    //                            <h6>Are you sure you want to delete this Texte?</h6>
    //                        </div>
    //                    </Modal.Body>

    //                    <Modal.Footer>
    //                        <Button variant="default" onClick={hideModalAndClearTriggers} >
    //                            Cancel
    //                        </Button>
    //                        <Button variant="danger" onClick={DeleteTexte}  >
    //                            Confirm
    //                        </Button>
    //                    </Modal.Footer>
    //                </>
    //        }
    //    </Modal>
    //)
}












