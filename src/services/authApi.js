import request from './request'

export const login = async (email, password) => {
  let response = await request("POST", "/sign_in", {email: email, password: password})
  let parsedResponse = response.json()
  //sessionStorage.setItem('email', parsedResponse.data.user.email);
  //sessionStorage.setItem('token', parsedResponse.data.user.authentication_token);
  return parsedResponse
}
