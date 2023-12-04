import React, { Component, useState, useEffect } from "react"
import { UseAuthContext } from '../context/AuthContext';
import { variables } from "../Variables"


export const Log = () => {

    const [triggers, setTriggers] = useState([]);
    const [clientIdLog, setClientIdLog] = useState("");
    const [officeIdLog, setOfficeIdLog] = useState(""); 
    

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
        const response = await fetch(variables.API_URL + 'OfficeTrigger/GetAllEmailsTransactionLog', {
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

    console.log()

    const filterData = (e) => {
        e.preventDefault();

        if (officeIdLog.trim() != "" || clientIdLog.trim() != "") {
            const result = triggers.filter(el => el.whiseOfficeid == officeIdLog || el.whiseClientid == clientIdLog)
            setTriggers(result)
            console.log(result)
            setOfficeIdLog("")
            setClientIdLog("")
            console.log("Record is Filter")
        }
    }

    const clearFilterRecord = () => {
        getTriggersByOffice();
    }

    console.log(officeIdLog)
    console.log(clientIdLog)



    return (
        

        <div>

            <h2>Trigger Transaction Log</h2>

            <div className= "my-4">

                <div className="mb-2">
                    <label htmlFor="officeIdInput" className="">Office Id : </label>
                    <input type="text" className=" ms-2 w-25" id="officeIdInput" placeholder="Office Id" value={officeIdLog} onChange={e => setOfficeIdLog(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label htmlFor="clientIdInput" className="form-label">Client Id :</label>
                    <input type="text" className=" ms-2 w-25" id="clientIdInput" placeholder="Client Id" value={clientIdLog} onChange={e => setClientIdLog(e.target.value)} />
                </div>


                <button className="btn bg-primary text-white px-4 me-2" onClick={filterData}  >Find</button>
                <button className="btn bg-primary text-white px-4 " onClick={clearFilterRecord}  >Clear</button>
             

  

            </div>

            <div className="row">


            <table className="table w-100 text-center">
                <thead>
                    <tr className="bg-primary text-white ">
                        <th className="border-bottom-0">Email Login Id</th>
                        <th className="border-bottom-0">Email</th>
                        <th className="border-bottom-0">Whise Office Id</th>
                        <th className="border-bottom-0">Whise Client Id</th>
                        <th className="border-bottom-0">Contact</th>
                        <th className="border-bottom-0">Calander On</th>
                        <th className="border-bottom-0">Estate</th>
                    </tr>
                </thead>

                <tbody>

                        {
                            triggers.map((item) => {
                            
                            return (
                                <tr className="text-center">
                                    <td>{item.emailLogid}</td>
                                    <td>{item.email}</td>
                                    <td>{item.whiseOfficeid}</td>
                                    <td>{item.whiseClientid}</td>
                                    <td>{item.contactId}</td>
                                    <td>{item.calenderActionId}</td>
                                    <td>{item.estateId}</td>
                                </tr>


                            )

                        })
                    }

                  
                </tbody>

            </table>


            </div>




        </div>

    )




}














