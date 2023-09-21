import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import axios from "axios";

function GenerateCertificate(props) {

  var { isPopupForCert, closePopupForCert } = props;

  const [loginresponse, setLoginresponse] = useState({});

  useEffect(() => {
    var loginresponse = JSON.parse(localStorage.getItem("loginresponse"));
    setLoginresponse(loginresponse);
  }, []);

  var [value, setValue] = useState({
    password: "",
  });
  
  async function postData(e) {
    e.preventDefault();

    await axios
      .post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "admin/smartlink/certificate/",
        {
          org_id: loginresponse.org_id,
          cert_password: value.password,
        }
      )
      .then((res) => {
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
    closePopupForCert(false);
  }

  return (
    isPopupForCert && (
      <div className="popup">
        <div className="popup-inner" style={{ width: "300px" }}>
          <div className="title">
            <center>
              <h2 style={{ marginLeft: "40px" }}>Generate Certificate</h2>
            </center>
            <img
              src="./images/close.png"
              className="icon1"
              onClick={close}
              style={{ marginTop: "20px" }}
            ></img>
          </div>
          <form onSubmit={(e) => postData(e)}>
            <label for="password">
              <b>Password</b>
            </label>
            <input
              Type="password"
              placeholder="Enter Password"
              id="password"
              onChange={(e) => handle(e)}
              name="sname"
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

export default GenerateCertificate;
