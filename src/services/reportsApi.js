import request from './request'

export const getWashesReport = async (startDate, endDate) => {
  let response = await request('GET', `/reports/washes_report?start_date=${startDate}&end_date=${endDate}`)
  return response.json()
}

