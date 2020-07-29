import request from "./request";

export const getVehicles = async () => {
	let response = await request("GET", "/vehicles");
	return response.json();
};

export const postVehicle = async (body) => {
	let response = await request("POST", "/vehicles", body);
	return response.json();
};
