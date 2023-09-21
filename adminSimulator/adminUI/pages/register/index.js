import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';



export default function Register() {

    const [data, setData] = useState({
        name: "",
        password: "",
        repeatPassword: "",
    });

    var [response, setResponse] = useState("");

    async function postData(e) {
        e.preventDefault();



        if (data.password == data.repeatPassword) {
            await axios
                .post(process.env.NEXT_PUBLIC_API_BASE_URL+"user/register",
                    {
                        name: data.name,
                        password: data.password
                    })
                .then(data => {
                    if (data.data === "Registsered successfully") {
                        setResponse("Registered Successfully")
                    } else {
                        setResponse("User Already Exists")
                    }
                    const load = () => window.location.reload(true);
                    const myTimeout = setTimeout(load, 3000);
                })
                .catch(error => console.log(error));
        }
        else {
            setResponse("Password and repeat password doesn't match");
        }
    };

    function handle(e) {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    return (
        <div className='contain'>
            <h1>Register</h1>
            <div className='register'>
                <form className='registerForm' onSubmit={(e) => postData(e)}>
                    <label><b>Username</b></label><br />
                    <input Type="text" placeholder="Enter Username" id="name" value={data.name} onChange={(e) => handle(e)} required /><br />

                    <label><b>Password</b></label><br />
                    <input Type="password" placeholder="Enter Password" id="password" value={data.password} onChange={(e) => handle(e)} required /><br />

                    <label><b>Repeat Password</b></label><br />
                    <input Type="password" placeholder="Repeat Password" id="repeatPassword" value={data.repeatPassword} onChange={(e) => handle(e)} required /><br />

                    <div className='button'>
                        <button Type='submit'>Register</button><br />
                    </div>
                    <p className='sign'>Already a User?<a href="/">Login</a></p>

                </form>

            </div>
            <div className='res'>{response}</div>
        </div>

    )
}
