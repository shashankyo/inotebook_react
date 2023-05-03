import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

const Signup = () => {
  const [credentials, setCredentials] = useState({name:"",email: "", password: "", cpassword:""}) 
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password, cpassword} = credentials;    

    const response = await fetch("http://localhost:5000/api/auth/login", {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email, password})
    });
    const json = await response.json()
    console.log(json);
    if (json.success){
        // Save the auth token and redirect
        localStorage.setItem('token', json.authtoken); 
        history.push("/");

    }
    else{
        alert("Invalid credentials");
    }
}

const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}

    return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email">Name</label>
                <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" placeholder="Enter name"/>
            </div>

                <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email"/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>

                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} placeholder="Password" required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" onChange={onChange} className="form-control" name='cpassword' id="cpassword" minLength={5} placeholder="Confirm Password" required/>
                </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                )
                }
                
  export default Signup
