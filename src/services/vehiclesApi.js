import request from "./request";

export const getVehicles = async () => {
	let response = await request("GET", "/vehicles");
	return response.json();
};

let body = {
	user_id: "84951fe3-c999-49bf-8b51-fa3819e694b2",
	registration_number: "GG11GGGP",
};

export const postVehicle = async () => {
	let response = await request("POST", "/vehicles", body);
	return response.json();
};
