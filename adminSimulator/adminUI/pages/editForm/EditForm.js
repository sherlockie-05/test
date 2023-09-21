import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

function EditForm(props) {

  var { isPopup, closePopup, index } = props;

  const [smartData, setSmartData] = useState({});
  const [loginresponse, setLoginresponse] = useState({});

  useEffect(() => {

    const loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setLoginresponse(loginresponse);
    const smartLinkData = JSON.parse(localStorage.getItem("smartlink_data"));
    setSmartData(smartLinkData);
  }, [props]);

  async function postData(e) {
    e.preventDefault();
    await axios
      .put(process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/", {
        org_id: loginresponse.org_id,
        id: smartData[index].id,
        name: smartData[index].name,
      })
      .then((res) => {
        if (res.data.status_code == 200) {
          localStorage.setItem("smartlink_data", JSON.stringify(smartData));
          window.location.reload();
        }
      })
      .catch((error) => console.log(error));
  }

  function handle(e) {
    const newData = { ...smartData };
    newData[e.target.id] = e.target.value;
    smartData[index].name = newData.name;
  }

  function close() {
    closePopup(false);
    localStorage.setItem("sm-index", JSON.stringify(""));
  }

  return (
    isPopup && (
      <div className="popup">
        <div className="popup-inner">
          <div className="title">
            <center>
              <h2 style={{ marginLeft: "80px" }}>Edit SmartLink</h2>
            </center>
            <img
              src="./images/close.png"
              className="icon1"
              style={{ marginTop: "20px" }}
              onClick={close}
            ></img>
          </div>
          <form onSubmit={(e) => postData(e)}>
            <label for="sname">
              <b>SmartLink Name</b>
            </label>
            <input
              type="text"
              placeholder="Enter SmartLink name"
              id="name"
              defaultValue={smartData[index]?.name}
              onChange={(e) => handle(e)}
              name="sname"
              required
            />
            <br />

            <label for="oname">
              <b>Hospital</b>
            </label>
            <input
              type="text"
              placeholder="Enter Hospital name"
              id="OrganizationName"
              defaultValue={loginresponse.org_name}
              onChange={(e) => handle(e)}
              name="oname"
              required
            />
            <br />

            <div className="button">
              <button
                Type="submit"
                style={{ marginTop: "10px" }}
                className="Btn-Style"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default EditForm;
