import React, { useState } from "react";
import { postCustomer } from "../services/customersApi.js";

const AddCustomerForm = () => {
	let [customerData, setCustomerData] = useState({
		email: "",
		name: "",
		contact_number: "",
	});

	let customerBody = {
		email: customerData.email,
		name: customerData.name,
		contact_number: customerData.contact_number,
		vehicles: [],
	};

	const handlePostCustomer = async () => {
		let res = await postCustomer(customerBody);
		console.log(res);
	};

	return (
		<div className="row">
			<div className="col-auto">
				<label>Email</label>
				<input
					onChange={(e) =>
						setCustomerData({ ...customerData, email: e.target.value })
					}
					className="form-control"
				></input>
			</div>
			<div className="col-auto">
				<label>Name</label>
				<input
					onChange={(e) =>
						setCustomerData({ ...customerData, name: e.target.value })
					}
					className="form-control"
				></input>
			</div>
			<div className="col-auto">
				<label>Contact Number</label>
				<input
					onChange={(e) =>
						setCustomerData({ ...customerData, contact_number: e.target.value })
					}
					className="form-control"
				></input>
			</div>
			<div className="col-auto d-flex align-items-end">
				<button className="btn btn-secondary" onClick={handlePostCustomer}>
					Create Customer
				</button>
			</div>
		</div>
	);
};

export default AddCustomerForm;
