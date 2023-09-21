import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import axios from "axios";

function PushToPacs(props) {

  var { isPopupForPushToPacs, closePopupForPushToPacs, smconfigIndex } = props;

  const [loginresponse, setLoginresponse] = useState({});
  const [smartlinkdata, setsmartlinkdata] = useState([]);

  useEffect(() => {
    var loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setLoginresponse(loginresponse);
    var smartlinkdata = JSON.parse(localStorage.getItem("smartlink_data"));
    setsmartlinkdata(smartlinkdata);
  }, []);

  var [value, setValue] = useState({
    Image_Names: "",
  });

  async function postData(e) {
    e.preventDefault();
    var valueObject = value;
    var images = valueObject.Image_Names;
    const imageArray = images;

    await axios
      .post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/notify",
        {
          id: smartlinkdata[smconfigIndex].id,
          org_id: loginresponse.org_id,
          message_type: "STORE_TO_PACS",
          message: {
            MessageBody: {
              content: imageArray,
            },
            MessageType: "STORE_TO_PACS",
            MessageReceiver: smartlinkdata[smconfigIndex].id,
          },
          message_time: JSON.parse(JSON.stringify(new Date())),
        }
      )
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  function handle(e) {
    const newData = { ...value };
    newData[e.target.id] = e.target.value;
    setValue(newData);
  }

  function close() {
    closePopupForPushToPacs(false);
  }

  return (
    isPopupForPushToPacs && (
      <div className="popup">
        <div className="popup-inner" style={{ width: "350px" }}>
          <div className="title">
            <center>
              <h2 style={{ marginLeft: "90px" }}>Push To Pacs</h2>
            </center>
            <img
              src="./images/close.png"
              className="icon1"
              onClick={close}
              style={{ marginTop: "20px" }}
            ></img>
          </div>
          <form onSubmit={(e) => postData(e)}>
            <label for="Image_Names">
              <b>Enter Image Names</b>
            </label>
            <input
              Type="text"
              placeholder="Enter Image Names"
              id="Image_Names"
              onChange={(e) => handle(e)}
              required
            />
            <br />

            <div className="button">
              <button
                Type="submit"
                style={{ marginTop: "10px" }}
                className="Btn-Style"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default PushToPacs;
