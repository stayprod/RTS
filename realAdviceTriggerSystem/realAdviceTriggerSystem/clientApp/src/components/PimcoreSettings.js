import React, { Component, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Nav, Form, Image, Button, Navbar, Dropdown, Container, ListGroup, InputGroup, NavDropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import { variables } from '../Variables';
import { useToken } from './tokenContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const PimcoreSettings = (props) => {
    const { pcSettingsList, removePimcoreSettings } = props;
     
    return (
        pcSettingsList.length != undefined && pcSettingsList.length > 0 ? pcSettingsList.map((item, i) => {
            return (<div className="row position-relative" id={"row-" + i}><div className="col-sm-4 mb-3 mb-md-3">
                <label>First Name</label>
                <input type="text" className="form-control" id={"pimcoreFName" + i} defaultValue={item.firstName} />
            </div>
                <div className="col-sm-4 mb-3 mb-md-3">
                    <label>Last Name</label>
                    <input type="text" className="form-control" id={"pimcoreLName" + i} defaultValue={item.lastName} />
                </div>
                <div className="col-sm-4 mb-3 mb-md-3">
                    <label>Login Id</label>
                    <input type="text" className="form-control" id={"pimcoreLoginID" + i} defaultValue={item.loginId} />
                </div>
                <span className="remove-setting-icon" onClick={removePimcoreSettings} parentid={"row-" + i} title="Remove Setting" settingdetail={JSON.stringify(item)}>
                    <FontAwesomeIcon icon={faTrash} />
                </span>
            </div>)
        })
            :
        ""
    )

}