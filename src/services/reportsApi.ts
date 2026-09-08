import { api } from './api'

type ReportRow = Record<string, unknown>

const dateRange = (startDate: string, endDate: string) => ({
  start_date: startDate,
  end_date: endDate,
})

const report =
  (path: string) =>
  (startDate: string, endDate: string) =>
    api.get(`reports/${path}`, { searchParams: dateRange(startDate, endDate) })
      .json<ReportRow[]>()

export const getWashesReport = report('washes_report')
export const getUsersReport = report('user_washes')
export const getActiveUsersReport = report('active_users')
export const getDailyWashes = report('washes_daily.json')
export const getInsuredWashes = report('insurance.json')
export const getDailyWashesDetail = report('washes_daily_detail.json')

export const getWashesReportDownload = (startDate: string, endDate: string) =>
  api
    .get('reports/washes_report.csv', {
      searchParams: dateRange(startDate, endDate),
    })
    .blob()
