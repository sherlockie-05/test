import axios from "axios";
import { useState, useEffect } from "react";

export default function Editconfig(props) {

  const [Dicom, setDicom] = useState([]);
  const [loginresponse, setLoginresponse] = useState({});
  const [smartlink_data, setsmartlink_data] = useState([]);
  const [data, setData] = useState({
    conn_id: "",
    name: "",
    aetitle: "",
    host_name: "",
    node_type: "",
    port: "",
    status: "",
  });

  var Status;
  Dicom == undefined ? (Status = "") : (Status = Dicom[index]?.status);
  var { isPopupForEditConfig, closePopupForEditConfig, index, smconfigIndex } =
    props;

  useEffect(() => {
    var DicomNodes = JSON.parse(localStorage.getItem("dicomArray"));
    setDicom(DicomNodes);
    index == null? setData("") : setData(Dicom[index]);
    var loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setLoginresponse(loginresponse);
    var smartlink_data = JSON.parse(localStorage.getItem("smartlink_data"));
    setsmartlink_data(smartlink_data);
  }, [props]);

  function handle(e) {
    const newData = {
      ...Dicom[index],
    };
    newData[e.target.id] = e.target.value;
   


    Dicom[index] = newData;
    setData(newData);
  }

  function status(e){
    var activeStatus = { ...Status };
    activeStatus = e.target.checked;
    
    if (activeStatus) {
      Status = "ACTIVE";
    } else {
      Status = "INACTIVE";
    }
     Dicom[index].status = Status;

  }
  // console.log("name",data==undefined?"nothing":data.name);
  async function postData(e) {
    e.preventDefault();

    var date = JSON.stringify(new Date());
    // var LastConfigUpdated = JSON.parse(date);
    await axios
      .put(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "admin/smartlink/" +
          smartlink_data[smconfigIndex].id +
          "/connection",
        {
          org_id: loginresponse.org_id,
          id: smartlink_data[smconfigIndex].id,
          connections: {
            dicom: [
              {
                conn_id: Dicom[index].conn_id,
                name: data.name,
                aetitle: data.aetitle,
                host_name: data.host_name,
                node_type: data.node_type,
                port: Number(data.port),
                status: Dicom[index].status,
              },
            ],
          },
        }
      )

      .then((res) => {
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  function close() {
    closePopupForEditConfig(false);
  }
  return (
    isPopupForEditConfig && (
      <div className="popup">
        <div className="popup-inner">
          <div className="title">
            <center>
              <h2 style={{ marginLeft: "60px" }}>Modify Dicom Node</h2>
            </center>
            <img
              src="./images/close.png"
              className="icon1"
              onClick={close}
              style={{ marginTop: "20px" }}
            ></img>
          </div>
          <form onSubmit={(e) => postData(e)}>
            <label for="nname">
              <b> Node Name</b>
            </label>
            <input
              Type="text"
              placeholder="Enter the Node name"
              id="name"
              defaultValue={Dicom[index].name}
              onChange={(e) => handle(e)}
              name="nname"
              required
            />
            <br />

            <label for="hname">
              <b>Host Name</b>
            </label>
            <input
              Type="text"
              placeholder="Enter Organization name"
              id="host_name"
              defaultValue={Dicom[index].host_name}
              onChange={(e) => handle(e)}
              name="hname"
              required
            />
            <br />

            {/* <label for="ip"><b>IP Address</b></label>
                        <input Type="text" placeholder="Enter IP Address" id="IPAddress" defaultValue={data.IPAddress} onChange={(e) => handle(e)} name="ip" required /><br /> */}

            <label for="AETitle">
              <b>AE Title</b>
            </label>
            <input
              Type="text"
              placeholder="Enter AE Title"
              id="aetitle"
              defaultValue={Dicom[index].aetitle}
              onChange={(e) => handle(e)}
              name="AETitle"
              required
            />
            <br />

            <label for="Port">
              <b>Port</b>
            </label>
            <input
              Type="number"
              placeholder="Enter Port"
              id="port"
              defaultValue={Dicom[index].port}
              onChange={(e) => handle(e)}
              name="Port"
              required
            />
            <br />

            <label for="Type">
              <b>Type</b>
            </label>
            <select
              name="Type"
              id="node_type"
              defaultValue={Dicom[index].node_type}
              onChange={(e) => handle(e)}
            >
              <option value="OTHER_SCU">OTHER_SCU</option>
              <option value="ROUTER_SCP">ROUTER_SCP</option>
              <option value="ROUTER_SCU">ROUTER_SCU</option>
              <option value="PACS">PACS</option>
              <option value="ROUTER_MWL_SCP">ROUTER_MWL_SCP</option>
              <option value="ROUTER_MWL_SCU">ROUTER_MWL_SCU</option>
              <option value="MODALITY">MODALITY</option>
            </select>
            <br />

            {/* <label for="DefaultNode">
              <b>DefaultNode</b>
            </label> */}
            <br />
            <div className="act">
              <input
                Type="checkbox"
                id="Status"
                name="Active"
                value={Status}
                defaultChecked={Dicom[index].status == "ACTIVE"}
                onChange={(e) => status(e)}
              />
              <label for="active"> Active</label>
              <br />
            </div>

            <div
              className="btn"
              style={{ marginTop: "10px", marginLeft: "38%" }}
            >
              <button Type="submit" className="Btn-Style">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
