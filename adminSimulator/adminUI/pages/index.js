import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [data, setData] = useState({
    name: "",
    password: "",
  });

  const router = useRouter();

  var [response, setResponse] = useState("");
  var obj = {};

  async function postData(e) {
    e.preventDefault();

    await axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + "admin/user/login", {
        name: data.name,
        password: data.password,
      })
      .then((res) => {
        var resString = res.data.data;
        var resData = JSON.parse(resString);
        if (typeof resData === typeof obj) {
          var dat = resData;
          localStorage.setItem("sm-data", JSON.stringify(dat));
          dat.smartLink != undefined
            ? localStorage.setItem(
                "smartlink_data",
                JSON.stringify(dat.smartLink)
              )
            : localStorage.setItem("smartlink_data", JSON.stringify([]));
          localStorage.setItem("loginresponse", JSON.stringify(dat));
          localStorage.setItem("sm-index", JSON.stringify(""));
          router.push({ pathname: "/userTable" });
        } else if (resData == "User doesn't exists") {
          setResponse("No user Exist");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setResponse("Response not recieved");
      });
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  return (
    <div>
      <div className="header">
        <h1>Exo SmartLink Administration</h1>
      </div>
      <div className="contain" style={{ borderStyle: "none" }}>
        <div className="login">
          <h1>Login</h1>
          <form onSubmit={(e) => postData(e)}>
            <label for="uname">
              <b>Username</b>
            </label>
            <input
              Type="text"
              placeholder="Enter Username"
              name="uname"
              id="name"
              value={data.name}
              onChange={(e) => handle(e)}
              required
            />
            <br></br>

            <label for="psw">
              <b>Password</b>
            </label>
            <input
              Type="password"
              placeholder="Enter Password"
              name="psw"
              id="password"
              value={data.password}
              onChange={(e) => handle(e)}
              required
            />
            <br></br>

            <div className="button">
              <button Type="submit" className="Btn-Style">
                Login
              </button>
              <br />
            </div>
            <div className="res">{response}</div>
          </form>
        </div>
      </div>
      <div className="footer">
        <p>
          (C) Copyright - Exo Imaging, Inc - (Technical POC software, NOT FOR
          USE)
        </p>
      </div>
    </div>
  );
}
