import React, { useState } from "react";
import { postVehicle } from "../services/vehiclesApi";

const AddVehicleForm = () => {
	let [vehicleData, setVehicleData] = useState({
		registration_number: "",
		user_id: "",
	});

	let vehicleBody = {
		user_id: vehicleData.user_id,
		registration_number: vehicleData.registration_number,
	};

	const handlePostVehicle = async () => {
		let res = await postVehicle(vehicleBody);
		console.log(res);
	};

	return (
		<div className="row">
			<div className="col-auto">
				<label>User ID</label>
				<input
					onChange={(e) =>
						setVehicleData({ ...vehicleData, user_id: e.target.value })
					}
					className="form-control"
				></input>
			</div>
			<div className="col-auto">
				<label>Registration Number</label>
				<input
					onChange={(e) =>
						setVehicleData({
							...vehicleData,
							registration_number: e.target.value,
						})
					}
					className="form-control"
				></input>
			</div>
			<div className="col-auto d-flex align-items-end">
				<button className="btn btn-secondary" onClick={handlePostVehicle}>
					Add Vehicle
				</button>
			</div>
		</div>
	);
};

export default AddVehicleForm;
