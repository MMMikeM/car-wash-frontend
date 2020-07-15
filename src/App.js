import React, { useState } from "react";
import "./css/main.css";
import { getCustomers } from "./services/customersApi.js";
import { getVehicles } from "./services/vehiclesApi";
import AddCustomerForm from "./components/addCustomerForm";
import AddVehicleForm from "./components/addVehicleForm";
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
				</div>
				<div className="col-auto">
					<ul>
						{localCustomers.map((x, y) => (
							<div>
								<li key={y}>
									{x.name + " " + x.email + " " + x.contact_number}
								</li>
								<li key={y}>{x.id}</li>
							</div>
						))}
					</ul>

					<ul>
						{localVehicles.map((x, y) => (
							<div>
								<li key={y}>{x.registration_number}</li>
								<li key={y}>{x.id}</li>
							</div>
						))}
					</ul>
				</div>
			</div>
			<AddVehicleForm />
			<AddCustomerForm />
		</div>
	);
}

export default App;
