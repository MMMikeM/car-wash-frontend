import React from 'react'
import dayjs from 'dayjs'
import { getActiveUsersReport } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'

const ActiveUsersReport = () => (
  <ReportPage
    fetchReport={getActiveUsersReport}
    fields={['name', 'contact_number']}
    headings={['name', 'contact_number']}
    initialStartDate={dayjs().subtract(7, 'month').format('YYYY-MM-DD')}
    showFilters={false}
  />
)

export default ActiveUsersReport
