import React from 'react'
import { formatDateTime } from '../../helpers'
import { getDailyWashesDetail } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { hasRole } from '@/lib/auth'

const DailyWashesDetail = () => {
  const isManager = hasRole('manager')

  return (
    <ReportPage
      fetchReport={getDailyWashesDetail}
      fields={['wash_type_name', 'name', 'contact_number', 'created_at']}
      headings={['Wash', 'Name', 'Contact Number', 'Created Time']}
      transform={(rows) =>
        rows.map((row) => {
          row.created_at = formatDateTime(new Date(row.created_at))
          return row
        })
      }
      showFilters={isManager}
      heading={isManager ? null : "Today's Washes"}
    />
  )
}

export default DailyWashesDetail
