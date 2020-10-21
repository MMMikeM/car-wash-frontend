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

export const getDailyWashes = async (startDate, endDate) => {
  let response = await request(
    'GET',
    `/reports/washes_daily.json?start_date=${startDate}&end_date=${endDate}`
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
