import React, { useState } from "react";
import { login } from "./services/authApi.js";
import "./css/main.css";
import { getCustomers } from "./services/customersApi.js";
import { getVehicles, postVehicle } from "./services/vehiclesApi";

function App() {
	let [loginCredsEmail, setLoginCredsEmail] = useState("");
	let [loginCredsPassword, setLoginCredsPassword] = useState("");
	let [isLoggedIn, setLoggedIn] = useState(false);
	let [isLoading, setIsLoading] = useState(false);
	let [localVehicles, setLocalVehciles] = useState([]);

	const handleLogin = async () => {
		setIsLoading(true);
		let loginResponse = await login(loginCredsEmail, loginCredsPassword);
		if (!loginResponse.is_success) {
			alert("Login Failed");
		} else {
			sessionStorage.setItem("email", loginResponse.data.user.email);
			sessionStorage.setItem(
				"token",
				loginResponse.data.user.authentication_token
			);
			handleFetchCustomers();
			setLoggedIn(true);
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		sessionStorage.removeItem("email");
		sessionStorage.removeItem("token");
	};

	const handleFetchCustomers = async () => {
		let localCustomers = await getCustomers();
		console.log(localCustomers);
	};

	const handleFetchVehicles = async () => {
		let res = await getVehicles();
		setLocalVehciles(res);
		console.log(localVehicles);
	};

	const handlePostVehicle = async () => {
		let res = await postVehicle();
		console.log(res);
	};

	return (
		<div className="App">
			<h1 className="display-1">Welcome to the carwash</h1>
			{isLoading ? (
				<h2>please wait, loading</h2>
			) : isLoggedIn ? (
				<h2>You are logged in</h2>
			) : (
				<h2>Please log in</h2>
			)}
			<input
				type="text"
				onChange={(e) => setLoginCredsEmail(e.target.value, "email")}
			/>
			<input
				type="password"
				onChange={(e) => setLoginCredsPassword(e.target.value, "password")}
			/>
			<button onClick={handleLogin}>Login</button>
			<button onClick={handleLogout}>Logout</button>
			<button onClick={handleFetchCustomers}>fetchCustomers</button>
			<button onClick={handleFetchVehicles}>fetchVehicles</button>
			<button onClick={handlePostVehicle}>PostVehicle</button>

			{localVehicles.map((x) => (
				<div className="display-5">{x.registration_number}</div>
			))}
		</div>
	);
}

export default App;
