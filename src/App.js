import React, { useState } from "react";
import { login } from "./services/authApi.js";
import "./css/main.css";
import { getCustomers } from "./services/customersApi.js";

function App() {
	let [loginCredsEmail, setLoginCredsEmail] = useState('');
	let [loginCredsPassword, setLoginCredsPassword] = useState('');

  const handleLogin = async () => {
    let loginResponse = await login(loginCredsEmail, loginCredsPassword)
    if (!loginResponse.is_success) {
      alert("Login Failed") 
    } else {
      sessionStorage.setItem('email', loginResponse.data.user.email);
      sessionStorage.setItem('token', loginResponse.data.user.authentication_token);
      handleFetchCustomers()
    }
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
  }

  const handleFetchCustomers = async () => {
    let localCustomers = await getCustomers()
    console.log(localCustomers)
  }

	return (
		<div className="App">
      <input type="text" onChange={e => setLoginCredsEmail(e.target.value, "email")}/>
      <input type="password" onChange={e => setLoginCredsPassword(e.target.value, "password")}/>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleFetchCustomers}>fetchCustomers</button>
		</div>
	);
}

export default App;
