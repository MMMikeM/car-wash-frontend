import React, { useState } from "react";
import { login } from "../services/authApi.js";

const Login = () => {
	let [loginCredsEmail, setLoginCredsEmail] = useState("");
	let [loginCredsPassword, setLoginCredsPassword] = useState("");
	let [isLoggedIn, setLoggedIn] = useState(false);
	let [isLoading, setIsLoading] = useState(false);

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
			setLoggedIn(true);
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		sessionStorage.removeItem("email");
		sessionStorage.removeItem("token");
	};

	return (
		<React.Fragment>
			<div className="my-2">
				{isLoading ? (
					<h2>please wait, loading</h2>
				) : isLoggedIn ? (
					<h2>You are logged in</h2>
				) : (
					<h2>Please log in</h2>
				)}
			</div>
			<div>
				<label>Username</label>
				<input
					className="form-control"
					type="text"
					onChange={(e) => setLoginCredsEmail(e.target.value, "email")}
				/>
				<label>Password</label>
				<input
					className="form-control"
					type="password"
					onChange={(e) => setLoginCredsPassword(e.target.value, "password")}
				/>
			</div>

			<div className="mt-2 mb-5">
				<button className="btn btn-secondary mr-1" onClick={handleLogin}>
					Login
				</button>
				<button className="btn btn-secondary" onClick={handleLogout}>
					Logout
				</button>
			</div>
		</React.Fragment>
	);
};

export default Login;
