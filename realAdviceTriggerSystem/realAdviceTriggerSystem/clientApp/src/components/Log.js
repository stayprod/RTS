import React, { Component, useState, useEffect } from "react"
import { UseAuthContext } from '../context/AuthContext';
import { variables } from "../Variables"
import moment from 'moment';


export const Log = () => {

    const [triggers, setTriggers] = useState([]);
    const [clientIdLog, setClientIdLog] = useState("");
    const [officeIdLog, setOfficeIdLog] = useState("");
    const [userIdLog, setUserIdLog] = useState("")
    

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
    console.log(triggers)

    useEffect(() => {
        getTriggersByOffice();
    }, [])


    const filterData = (e) => {
        e.preventDefault();

        if (officeIdLog.trim() != "" || clientIdLog.trim() != "" || userIdLog.trim() != "")
        {

            const result = triggers.filter(el => el.officeId == officeIdLog || el.clientId == clientIdLog || el.userId
                == userIdLog) 
            setTriggers(result)
            console.log(result)
            console.log("Record is Filter")
        }
    }

    const clearFilterRecord = () => {
        getTriggersByOffice();
        setClientIdLog("")
        setOfficeIdLog("")
        setUserIdLog("")
    }

    console.log(officeIdLog)
    console.log(clientIdLog)
    console.log(userIdLog)


    return (
        

        <div className="row">

            <h2>Trigger Transaction Log</h2>

            <div className= "my-4">

                <div className="mb-2">
                    <label htmlFor="officeIdInput" className="">Office Id : </label>
                    <input type="text" className=" ms-2 w-25" id="officeIdInput" value={officeIdLog} onChange={e => setOfficeIdLog(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label htmlFor="clientIdInput" className="form-label">Client Id :</label>
                    <input type="text" className=" w-25" id="clientIdInput" style={{ marginLeft: "9px" }} value={clientIdLog} onChange={e => setClientIdLog(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label htmlFor="userIdInput" className="form-label">User Id :</label>
                    <input type="text" className=" w-25 " id="userIdInput" style={{ marginLeft: "17px" }} value={userIdLog} onChange={e => setUserIdLog(e.target.value)} />
                </div>


                <button className="btn bg-primary text-white px-4 me-2" onClick={filterData}  >Find</button>
                <button className="btn bg-primary text-white px-4 " onClick={clearFilterRecord}  >Clear</button>
             

  

            </div>

            <div className="col-sm-12 mb-5" style={{ overflowX: "auto" }}>


            <table className="w-100 text-center">
                <thead>
                    <tr className="bg-primary text-white ">
                        <th className="p-2">Log Id</th>
                        <th className=" p-2">Object</th>
                        <th className="p-2">Event Id</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Error</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Email Open</th>
                            <th className="p-2">Click</th>
                            <th className="p-2">Client Id</th>
                            <th className="p-2">Client Name</th>
                            <th className="p-2">Office Id </th>
                            <th className="p-2">Office Name</th>
                            <th className="p-2">User Id</th>
                            <th className="p-2">Start Date Of Appointment</th>
                            <th className="p-2">End Date Of Appointment</th>
                            <th className="p-2">Contact Id</th>
                            <th className="p-2">Property Id</th>

                    </tr>
                </thead>

                <tbody>

                        {
                            triggers.length > 0 ? 
                                triggers.map((item) => {

                                    const startDate = moment(item.appointmentStartDate).format('MMMM Do YYYY, h:mm:ss a');
                                    const endDate = moment(item.appointmentEndDate).format('MMMM Do YYYY, h:mm:ss a');

                            return (
                                <tr className="text-center" key={item.emailTransactionLogId}>
                                    <td className="border-start border-end border-bottom p-2 justify-content-center">{item.emailTransactionLogId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{ (item.triggerType == 1) ? "Email" : "SMS" }</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.calendarEventId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.transactionDate}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.error}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.status}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.emailOpened}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.linkClicked}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.clientId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.clientName}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.officeId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.officeName}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.userId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{startDate}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{endDate}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.contactId}</td>
                                    <td className="border-end border-bottom p-2 justify-content-center">{item.estateId}</td>
                                </tr>


                                ) 

                            }) : 
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td rowSpan="3" >No Record Found</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                    }

                  
                </tbody>

            </table>


            </div>




        </div>

    )




}














