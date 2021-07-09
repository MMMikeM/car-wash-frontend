import request from './request'

export const getWashesReport = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/washes_report?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}

export const getUsersReport = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/user_washes?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}

export const getActiveUsersReport = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/active_users?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}

export const getDailyWashes = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/washes_daily.json?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}

export const getInsuredWashes = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/insurance.json?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}

export const getDailyWashesDetail = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/washes_daily_detail.json?start_date=${startDate}&end_date=${endDate}`
  )
  return response.json()
}


export const getWashesReportDownload = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/washes_report.csv?start_date=${startDate}&end_date=${endDate}`
  )
  return response.blob()
}
