import React, { Component, useState, useEffect } from "react"
import { UseAuthContext } from '../context/AuthContext';
import { variables } from "../Variables"
import moment from 'moment';
import { MDBDataTable } from 'mdbreact';
import "./log.css";

export const Log = () => {

    const [triggers, setTriggers] = useState([]);
    const {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    } = UseAuthContext();

    const getTriggersByOffice = async () => {
        if (authUser == null) {
            return
        }
        const response = await fetch(variables.API_URL + 'OfficeTrigger/GetAllTriggersEmailsTransactionLog', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authUser.tokenValue}`,
                'Content-Type': 'application/json'
            }
        });
        const jsonData = await response.json();
        if (jsonData != null) {
            setTriggers(jsonData);

        }
    }

    useEffect(() => {
        getTriggersByOffice();
    }, [])

    // Table Colummns data 
    const columns = [
        {
            label: 'Log Id',
            field: 'emailTransactionLogId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Object',
            field: 'triggerType',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Event Id',
            field: 'calendarEventId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Date',
            field: 'transactionDate',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Error',
            field: 'error',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Status',
            field: 'status',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Email Opened',
            field: 'emailOpened',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Click ',
            field: 'linkClicked',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Client Id ',
            field: 'clientId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Client Name ',
            field: 'clientName',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Office Id ',
            field: 'officeId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Office Name ',
            field: 'officeName',
            sort: 'asc',
            width: 150
        },
        {
            label: 'User Id ',
            field: 'userId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Start Date of Appointment',
            field: 'appointmentStartDate',
            format: (value) => formatDate(value),
            sort: 'asc',
            width: 150
        },
        {
            label: 'End Date of Appointment',
            field: 'appointmentEndDate',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Contact Id',
            field: 'contactId',
            sort: 'asc',
            width: 150
        },
        {
            label: 'Property Id',
            field: 'estateId',
            sort: 'asc',
            width: 150
        },
    ]

    //It is use for some custom changing in Orginal data ( Date Format, Object Values )
    const formattedData = triggers.map((item) => ({
        ...item,
        transactionDate: moment(item.transactionDate).format('MMMM Do YYYY, h:mm:ss a'),
        appointmentEndDate: moment(item.appointmentEndDate).format('MMMM Do YYYY, h:mm:ss a'),
        appointmentStartDate: moment(item.appointmentStartDate).format('MMMM Do YYYY, h:mm:ss a'),
        triggerType: ((item.triggerType == 1) ? "Email" : "SMS"),

    }));

    return (

        <div className="row">
            <h2>Trigger Transaction Log</h2>

            <div className="col-sm-12 mb-5 text-center log_table " style={{ overflowX: "auto" }} >
                <MDBDataTable
                    bordered
                    small
                    data={{ columns, rows: formattedData }}
                    noBottomColumns={true}
                    className="mdbDataTable"
                />
            </div>
        </div>
    )
}