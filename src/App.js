import React, { useState, useEffect } from "react";
import { getCustomers } from "./services/customersApi.js";
import "./css/main.css";

function App() {
	let [customers, setCustomers] = useState([]);
	let [loading, setLoading] = useState(true);

	useEffect(() => {
		getCustomers().then((res) => {
			setCustomers(res);
			setLoading(false);
		});
	});
	return (
		<div className="App">
			{loading ? (
				<div>Loading...</div>
			) : (
				customers.map((c) => <div>{c.name}</div>)
			)}
		</div>
	);
}

export default App;
