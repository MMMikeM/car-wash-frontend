import React, { useState } from "react";
import "./css/main.css";
import { getCustomers, postCustomer } from "./services/customersApi.js";
import { getVehicles, postVehicle } from "./services/vehiclesApi";
import AddCustomerForm from "./components/addCustomerForm";
import Login from "./components/login";

function App() {
	let [localVehicles, setLocalVehicles] = useState([]);
	let [localCustomers, setLocalCustomers] = useState([]);

	const handleFetchCustomers = async () => {
		let res = await getCustomers();
		setLocalCustomers(res);
		console.log(localCustomers);
	};

	const handleFetchVehicles = async () => {
		let res = await getVehicles();
		setLocalVehicles(res);
		console.log(localVehicles);
	};

	let vehicleBody = {
		user_id: localCustomers ? localCustomers.id : console.log("no customer id"),
		registration_number: "testtest123",
	};

	const handlePostVehicle = async () => {
		let res = await postVehicle(vehicleBody);
		console.log(res);
	};

	return (
		<div className="App container w-75 px-5">
			<h1 className="display-3 text-center">Welcome to the carwash</h1>

			<Login />
			<div className="row mb-5">
				<div className="col-auto d-flex flex-column ">
					<button className="btn btn-secondary" onClick={handleFetchCustomers}>
						List Customers
					</button>
					<button
						className="btn btn-secondary my-2"
						onClick={handleFetchVehicles}
					>
						List Vehicles
					</button>
					<button className="btn btn-secondary" onClick={handlePostVehicle}>
						Add Vehicle
					</button>
				</div>
				<div className="col-auto">
					<ul>
						{localCustomers.map((x, y) => (
							<li key={y}>{x.name}</li>
						))}
					</ul>

					<ul>
						{localVehicles.map((x, y) => (
							<div>
								<li key={y}>{x.registration_number}</li>
								{/* <li key={y}>{x.id}</li> */}
							</div>
						))}
					</ul>
				</div>
			</div>

			<AddCustomerForm />
		</div>
	);
}

export default App;
