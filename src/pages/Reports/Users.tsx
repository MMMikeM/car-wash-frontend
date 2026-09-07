import React from 'react'
import { getUsersReport } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { sumReportTotal } from '../../helpers'
import { hasRole } from '@/lib/auth'

const UsersReport = () => {
  const isManager = hasRole('manager')

  return (
    <ReportPage
      fetchReport={getUsersReport}
      fields={['name', 'vehicles/registration_number', 'contact_number']}
      headings={['name', 'vehicles/registration_number', 'contact_number']}
      total={sumReportTotal}
      showFilters={isManager}
      heading={isManager ? null : "Today's Transactions"}
    />
  )
}

export default UsersReport
