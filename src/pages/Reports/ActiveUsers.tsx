import React from 'react'
import { subMonths } from 'date-fns'
import { formatDate } from '../../helpers'
import { getActiveUsersReport } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'

const ActiveUsersReport = () => (
  <ReportPage
    fetchReport={getActiveUsersReport}
    fields={['name', 'contact_number']}
    headings={['name', 'contact_number']}
    initialStartDate={formatDate(subMonths(new Date(), 7))}
    showFilters={false}
  />
)

export default ActiveUsersReport
