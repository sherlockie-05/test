import React, { useState, useEffect } from "react";
import axios from "axios";
import EditForm from "../editForm/EditForm";
import GenerateCertificate from "../generateCertificate/GenerateCertificate";
import UserForm from "../userForm/UserForm";
import ConfigForm from "../configForm/ConfigForm";
import EditConfig from "../editConfig/EditConfig";
import PushToPacs from "../pushToPacs/PushToPacs";

export default function Usertable() {
  const [sData, setsData] = useState({});
  const [loginresponse, setloginresponse] = useState({});
  const [smartlinkdata, setsmartlinkdata] = useState([]);
  const [smconfigIndex, setsmconfigIndex] = useState(null);
  const [index, setIndex] = useState(null);
  const [dicomArray, setdicomArray] = useState([]);

  useEffect(() => {
    var smData = JSON.parse(localStorage.getItem("sm-data"));
    setsData(smData);
    var loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setloginresponse(loginresponse);
    var smartlinkdata = JSON.parse(localStorage.getItem("smartlink_data"));
    setsmartlinkdata(smartlinkdata);
  }, []);

  const [isPopup, setIsPopup] = useState(false);
  const [isPopupForCert, setIsPopupForCert] = useState(false);
  const [isPopupForPushToPacs, setIsPopupForPushToPacs] = useState(false);
  const [isPopupForSm, setIsPopupForSm] = useState(false);
  const [isPopupForConfig, setIsPopupForConfig] = useState(false);
  const [isPopupForEditConfig, setIsPopupForEditConfig] = useState(false);

  const closePopup = () => {
    setIsPopup(false);
  };

  const closePopupForCert = () => {
    setIsPopupForCert(false);
  };

  const closePopupForPushToPacs = () => {
    setIsPopupForPushToPacs(false);
  };

  const closePopupForConfig = () => {
    setsmconfigIndex(null);
    setIsPopupForConfig(false);
  };

  const closePopupForEditConfig = () => {
    setIsPopupForEditConfig(false);
  };

  const closePopupForsm = () => {
    setIsPopupForSm(false);
  };

  async function addsmartlink(){
      await axios
            .post(process.env.NEXT_PUBLIC_API_BASE_URL+"admin/smartlink",
            {
                org_id:loginresponse.org_id
            }
            )
            .then(res => {
                const response = JSON.parse(res.data.data);
                const obj = {}
                if (typeof(res) == typeof(obj)) {
                    response.hospitalName=loginresponse.org_name;
                     var newEntry = {
                                "name": response.name,
                                "id": response.id
                            };
                        var existingSmartlinkData = JSON.parse(localStorage.getItem("smartlink_data")) || [];
                        existingSmartlinkData.push(newEntry);
                        localStorage.setItem('sm-data', JSON.stringify(response));
                        localStorage.setItem("smartlink_data",JSON.stringify(existingSmartlinkData));
                        window.location.reload();
                    }
                else {
                    console.log("Data is not stored successfully");
                }
            })
            .catch(error => console.log(error));
  }

  async function deleteConfig(i) {
    var date = JSON.stringify(new Date());
    var lastDate = JSON.parse(date);
    await axios
      .delete(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "admin/smartlink/" +
          smartlinkdata[smconfigIndex].id +
          "/connection/" +
          dicomArray[i].conn_id
      )
      .then((res) => {
        window.location.reload();
      });
  }

  async function deleteSmartLink(i) {
    var date = JSON.stringify(new Date());
    var lastDate = JSON.parse(date);
    const smartLinkId = smartlinkdata[i].id;
    await axios
      .delete(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/" + smartLinkId
      )
      .then((res) => {
        const smData = smartlinkdata.filter(
          (smartLink) => smartLink.id != smartLinkId
        );
        localStorage.setItem("smartlink_data", JSON.stringify(smData));
        window.location.reload();
      });
  }

  var array1 = "";
  var array2 = "";
  array2 = smartlinkdata;
  array1 = dicomArray;

  function addconfig(index) {
    setIsPopupForConfig(true);
    setIndex(index);
  }

  async function pause(i) {
    await axios
      .put(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/" + smartlinkdata[i].id + "/status",{
            org_id:loginresponse.org_id,
            id:smartlinkdata[i].id,
            message:"UNKNOWN"
        }
      )
      .then(async (res) => {
        console.log("pause response",res.data);
        if(res.data.status_code==200){
          await axios.post( process.env.NEXT_PUBLIC_API_BASE_URL+"admin/smartlink/notify",{  
            id: smartlinkdata[i].id,
            org_id: loginresponse.org_id,
            message_type: 'PAUSE_SERVICE',
            message: {
              MessageBody: { conetent: 'SERVICE PAUSED' },
              MessageType: 'PAUSE_SERVICE',
              MessageReceiver: smartlinkdata[i].id
            },
           message_time: JSON.parse(JSON.stringify(new Date())),
          }).then((res)=>{
            console.log("notifyresponse:",res.data);
            window.location.reload();
          })
        }
      });
  }

  async function resume(i) {
    await axios
      .put(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/" + smartlinkdata[i].id + "/status",{
            org_id:loginresponse.org_id,
            id:smartlinkdata[i].id,
            message:"UNKNOWN"
        }
      )
      .then(async (res) => {
        console.log("resume response",res.data);
        if(res.data.status_code==200){
          await axios.post( process.env.NEXT_PUBLIC_API_BASE_URL+"admin/smartlink/notify",{  
            id: smartlinkdata[i].id,
            org_id: loginresponse.org_id,
            message_type: 'RESUME_SERVICE',
            message: {
              MessageBody: { conetent: 'SERVICE RESUMED' },
              MessageType: 'RESUME_SERVICE',
              MessageReceiver: smartlinkdata[i].id
            },
           message_time: JSON.parse(JSON.stringify(new Date())),
          }).then((res)=>{
            console.log("notifyresponse:",res.data);
            window.location.reload();
          })
        }
      });
  }

  async function downloadRoot() {
    await axios
      .get(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "software/smartlink/rootcerturl/" +
          sData.OrganizationId
      )
      .then((res) => {
        window.open(res.data);
      });
  }

  async function downloadClient() {
    window.open(
      process.env.NEXT_PUBLIC_API_BASE_URL +
        "admin/smartlink/certificate/" +
        loginresponse.org_id
    );
  }

  async function downloadRoot() {
    window.open(
      process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/certificate/root"
    );
  }

  async function downloadNodeConfig(i) {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/downloadconfig",
        {
          org_id: loginresponse.org_id,
          id: smartlinkdata[i].id,
        }
      );
      var smartlinkjson = JSON.stringify(response.data, null, 4);

      var Filename =
        response.data.smartlink.name +
        "_" +
        response.data.smartlink.org_name +
        ".json";

      const blob = new Blob([smartlinkjson], { type: "application/json" });

      const url = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.setAttribute("download", Filename);
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);

      downloadLink.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function downloadInstaller() {
    await axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/downloadurl")
      .then((res) => {
        var resString = res.data.data;
        var  response = JSON.parse(resString);
        window.open(response.url);
      });
  }

  function editSmartLink(i) {
    setIndex(i);
    setIsPopup(true);
  }

  function addconfig(i) {
    setsmconfigIndex(i);
    setIsPopupForConfig(true);
  }

  async function viewconfig(i) {
    setsmconfigIndex(i);
    await axios
      .get(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "admin/smartlink/" +
          smartlinkdata[i].id +
          "/connection",
        {
          id: smartlinkdata[i].id,
        }
      )
      .then((res) => {
        var viewresponse = JSON.parse(res.data.data);
        setdicomArray(viewresponse.connections.dicom);
        localStorage.setItem(
          "dicomArray",
          JSON.stringify(viewresponse.connections.dicom)
        );
      });
  }

  function editConfig(i) {
    setIndex(i);
    setIsPopupForEditConfig(true);
  }

  async function saveconfig(i) {
    await axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/notify", {
        id: smartlinkdata[i].id,
        org_id: loginresponse.org_id,
        message_type: "UPDATE_CONFIGURATION",
        message: {
          MessageBody: { content: "Configuration Updated" },
          MessageType: "UPDATE_CONFIGURATION",
          MessageReceiver: smartlinkdata[i].id
        },
        message_time: JSON.parse(JSON.stringify(new Date()))
      })
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          window.location.reload();
        },5000);
      })
  }

  function pushToPacs(i) {
    setsmconfigIndex(i);
    setIsPopupForPushToPacs(true);
  }
  return (
    <div>
      <div className="header">
        <h1 className="smartlink-Heading">SmartLink Configuration</h1>
        <h3 className="org_name">{loginresponse.org_name}</h3>
      </div>
      <div className="userTable">
        <div className="certificate">
          <button className="downBtn" onClick={() => downloadInstaller()}>
            Download Installer
          </button>
          {/* <button className="certBtn" onClick={() => setIsPopupForCert(true)}>
            Generate Certificate
          </button> */}
          {/* <img
            src="./images/root.png"
            onClick={() => downloadRoot()}
            className="icon submit-button"
            title="Download Root Certificate"
          ></img> */}
          {/* <img
            src="./images/d-Icon.png"
            onClick={() => downloadClient()}
            className="client-icon submit-button"
            title="Download Client Certificate"
          ></img> */}
        </div>
        {/* smartlink popup */}
        {/* <button
          onClick={() => setIsPopupForSm(true)}
          className="submit-button addsmartlink"
        >
          Add SmartLink Node
        </button> */}
           <button
          onClick={() => addsmartlink()}
          className="submit-button addsmartlink"
        >
          Add SmartLink Node
        </button>
        <table className="smartlink-table">
          <thead>
            <tr>
              <th>SmartLink Name</th>
              <th>Hospital</th>
              <th>Pause</th>
              <th>Resume</th>
              <th>Edit</th>
              <th>Download Configuration</th>
              <th>Add Dicomnode</th>
              <th>View Dicomnode</th>
              <th>Delete SmartLink</th>
              <th>Save Configuration</th>
              <th>Push to Pacs</th>
            </tr>
          </thead>
          <tbody>
            {array2?.map((details, i) => {
              return [
                <tr key={i}>
                  <td>{details == undefined ? "" : details.name}</td>
                  <td>{details == undefined ? "" : loginresponse.org_name}</td>
                  {/* <td>
                    <center>
                      {smartLinkStatus == "Resume" ? (
                        <img
                          src="./images/pause.png"
                          onClick={pause}
                          className="icon"
                          title="Click to Pause Service"
                        ></img>
                      ) : (
                        <img
                          src="./images/play.png"
                          onClick={resume}
                          className="icon"
                          title="Click to Resume Service"
                        ></img>
                      )}
                    </center>
                  </td> */}
                  <td><center> <img
                          src="./images/pause.png"
                          onClick={() => pause(i)}
                          className="icon"
                          title="Click to Pause Service"
                        ></img></center></td>
                      <td><center> <img
                          src="./images/play.png"
                          onClick={() => resume(i)}
                          className="icon"
                          title="Click to Resume Service"
                        ></img></center></td>
                  
                  <td>
                    <center>
                      <img
                        src="./images/edit.png"
                        onClick={() => editSmartLink(i)}
                        className="icon space"
                        title="Edit SmartLink Details"
                      ></img>
                    </center>
                  </td>
                  <td className="download">
                    <center>
                      <img
                        src="./images/download.png"
                        onClick={() => downloadNodeConfig(i)}
                        className="icon-small"
                        title="Download Configuration"
                      ></img>
                    </center>
                  </td>
                  <td className="add">
                    <center>
                      <img
                        src="./images/add.png"
                        onClick={() => addconfig(i)}
                        className="icon-small"
                        title="Add Dicomnode"
                      ></img>
                    </center>
                  </td>
                  <td className="add">
                    <center>
                      <img
                        src="./images/view(2).png"
                        onClick={() => viewconfig(i)}
                        className="icon-small"
                        title=" View Dicomnode"
                      ></img>
                    </center>
                  </td>
                  <td>
                    <center>
                      <img
                        src="./images/delete.png"
                        onClick={() => deleteSmartLink(i)}
                        className="icon"
                        title="Delete Node Details"
                      ></img>
                    </center>
                  </td>
                  <td>
                    <center>
                      <img
                        src="./images/save.png"
                        onClick={() => saveconfig(i)}
                        className="icon"
                        title="save Node Details"
                      ></img>
                    </center>
                  </td>
                  <td>
                    <center>
                      <img
                        src="./images/push.png"
                        onClick={() => pushToPacs(i)}
                        className="icon"
                        title="Push to Pacs"
                      ></img>
                    </center>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>

        <table className="dicom-table">
          <thead>
            <tr>
              <th>Node Name</th>
              <th>Host Name</th>
              <th>AE Title</th>
              <th>Port</th>
              <th>Node Type</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {array1?.map((detail, i) => {
              return [
                <tr key={i}>
                  <td>{detail.name}</td>
                  <td>{detail.host_name}</td>
                  <td>{detail.aetitle}</td>
                  <td>{detail.port}</td>
                  <td>{detail.node_type}</td>
                  <td>{detail.status}</td>
                  {/* <td><button onClick={() => editConfig(i)}>Edit</button><button onClick={() => deleteConfig(i)}>Delete</button></td> */}
                  <td>
                    <center>
                      <img
                        src="./images/edit.png"
                        onClick={() => editConfig(i)}
                        className="icon"
                        title="Edit Node Details"
                      ></img>
                    </center>
                  </td>
                  <td>
                    <center>
                      <img
                        src="./images/delete.png"
                        onClick={() => deleteConfig(i)}
                        className="icon"
                        title="Delete Node Details"
                      ></img>
                    </center>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <p>
          (C) Copyright - Exo Imaging, Inc - (Technical POC software, NOT FOR
          USE)
        </p>
      </div>
      <UserForm
        isPopupForSm={isPopupForSm}
        closePopupForsm={closePopupForsm}
      ></UserForm>
      <EditForm isPopup={isPopup} closePopup={closePopup} index={index}></EditForm>
      <GenerateCertificate
        isPopupForCert={isPopupForCert}
        closePopupForCert={closePopupForCert}
      ></GenerateCertificate>
      <PushToPacs
        isPopupForPushToPacs={isPopupForPushToPacs}
        smconfigIndex={smconfigIndex}
        closePopupForPushToPacs={closePopupForPushToPacs}
      ></PushToPacs>
      <ConfigForm
        isPopupForConfig={isPopupForConfig}
        closePopupForConfig={closePopupForConfig}
        smconfigIndex={smconfigIndex}
      ></ConfigForm>
      <EditConfig
        isPopupForEditConfig={isPopupForEditConfig}
        closePopupForEditConfig={closePopupForEditConfig}
        index={index}
        smconfigIndex={smconfigIndex}
      ></EditConfig>
    </div>
  );
}
