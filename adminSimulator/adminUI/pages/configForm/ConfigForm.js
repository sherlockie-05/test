import axios from "axios";
import { useEffect, useState } from "react";

export default function ConfigForm(props) {
  var obj = {};

  var { isPopupForConfig, closePopupForConfig, smconfigIndex } = props;

  const [Status, setStatus] = useState("ACTIVE");
  const [loginresponse, setLoginresponse] = useState({});
  const [smartlink_data, setsmartlink_data] = useState([]);
 

  useEffect(() => {
    var loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setLoginresponse(loginresponse);
    var smartlink_data = JSON.parse(localStorage.getItem("smartlink_data"));
    setsmartlink_data(smartlink_data);
  }, []);

  var [data, setData] = useState({
    NodeName: "",
    HostName: "",
    AETitle: "",
    Port: "",
    NodeType: "",
    DefaultNode: "",
  });

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  async function postData(e) {
    e.preventDefault();

    await axios
      .post(
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
                name: data.name,
                aetitle: data.aetitle,
                host_name: data.host_name,
                node_type: data.NodeType,
                port: Number(data.port),
                status: Status,
              },
            ],
          },
        }
      )
      .then((res) => {
        var response_dicom = JSON.parse(res.data.data);
        if (typeof res.data == typeof obj) {
          localStorage.setItem(
            "addconnectionresponse",
            JSON.stringify(res.data.data)
          );
          window.location.reload();
        } else {
          console.log("Data is not stored successfully");
        }
      })
      .catch((error) => console.log(error));
  }

  function checked(e) {
    var activeStatus = { ...data };
    activeStatus = e.target.checked;
    if (activeStatus) {
      setStatus("ACTIVE");
    } else {
      setStatus("IN ACTIVE");
    }
  }

  function close() {
    closePopupForConfig(false);
  }

  return (
    isPopupForConfig && (
      <div className="popup">
        <div className="popup-inner">
          <div className="title">
            <h2 className="mt0" style={{ marginLeft: "80px" }}>
              Add Dicom Node
            </h2>
            <img
              src="./images/close.png"
              className="icon1"
              onClick={close}
              style={{ marginTop: "10px" }}
            ></img>
          </div>
          <form onSubmit={(e) => postData(e)}>
            <label for="name">
              <b> name</b>
            </label>
            <input
              Type="text"
              placeholder="Enter name"
              id="name"
              value={data.name}
              onChange={(e) => handle(e)}
              name="name"
              required
            />
            <br />

            <label for="host_name">
              <b>host_name</b>
            </label>
            <input
              Type="text"
              placeholder="Enter host_name"
              id="host_name"
              value={data.host_name}
              onChange={(e) => handle(e)}
              name="host_name"
              required
            />
            <br />

            <label for="aetitle">
              <b>aetitle</b>
            </label>
            <input
              Type="text"
              placeholder="Enter aetitle"
              id="aetitle"
              value={data.aetitle}
              onChange={(e) => handle(e)}
              name="aetitle"
              required
            />
            <br />

            <label for="port">
              <b>port</b>
            </label>
            <input
              Type="number"
              placeholder="Enter port"
              id="port"
              value={data.port}
              onChange={(e) => handle(e)}
              name="port"
              required
            />
            <br />

            <label for="Type">
              <b>Type</b>
            </label>
            <select
              name="Type"
              id="NodeType"
              defaultValue="none"
              onChange={(e) => handle(e)}
            >
              <option value="none" selected disabled hidden>
                Select Type
              </option>
              <option value="OTHER_SCU">OTHER_SCU</option>
              <option value="ROUTER_SCP">ROUTER_SCP</option>
              <option value="ROUTER_SCU">ROUTER_SCU</option>
              <option value="PACS">PACS</option>
              <option value="ROUTER_MWL_SCP">ROUTER_MWL_SCP</option>
              <option value="ROUTER_MWL_SCU">ROUTER_MWL_SCU</option>
              <option value="MODALITY">MODALITY</option>
            </select>
            <br />

            {/* <label for="DefaultNode"><b>DefaultNode</b></label>
                        <select name="DefaultNode" id="DefaultNode" defaultValue="none" onChange={(e) => handle(e)}>
                            <option value="none" selected disabled hidden>Select Default Node</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="NA">NA</option>
                        </select><br /> */}

            <div className="act">
              <input
                Type="checkbox"
                id="Status"
                name="Active"
                value={Status}
                defaultChecked={Status == "ACTIVE"}
                onChange={(e) => checked(e)}
              />
              <label for="active"> Active</label>
              <br />
            </div>

            <div style={{ marginTop: "10px", marginLeft: "38%" }}>
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
