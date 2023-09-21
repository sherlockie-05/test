import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import axios from "axios";

function UserForm(props) {

    const { isPopupForSm, closePopupForsm } = props;

    const[loginresponse,setLoginresponse]=useState({});

    useEffect(() => {
        var loginresponse=JSON.parse(localStorage.getItem('loginresponse'));
        setLoginresponse(loginresponse);
      }, []);

      const [data, setData] = useState({
        SmartLinkName: ""
    });

    async function postData(e) {
        e.preventDefault();
        
        await axios
            .post(process.env.NEXT_PUBLIC_API_BASE_URL+"admin/smartlink",
            {
                name: data.SmartLinkName,
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

    };

    function handle(e) {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    function close()
    {
        closePopupForsm(false);
    }

    return (
        isPopupForSm && (
            <div className="popup" >
                <div className="popup-inner">
                <div className="title">
                        <center>
                            <h2 style={{marginLeft:"80px"}}>SmartLink Details</h2>
                        </center>
                        <img src="./images/close.png" className="icon1" onClick={close} style={{marginTop:"20px"}}></img>
                    </div>
                    <form onSubmit={(e) => postData(e)}>
                    <label for="sname"><b>SmartLink Name</b></label>
                    <input Type="text" placeholder="Enter SmartLink name" id="SmartLinkName" value={data.SmartLinkName} onChange={(e) => handle(e)} name="sname" required /><br />

                    <label for="oname"><b>Hospital</b></label>
                    <input Type="text" id="organizationName" value={loginresponse.org_name} required /><br />

                    <div className='button'>
                        <button Type="submit" className="Btn-Style">Submit</button>
                    </div>
                </form>
                </div>
            </div>
        )
    );
}

export default UserForm;
