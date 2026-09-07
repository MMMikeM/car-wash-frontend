import React from 'react'
import { getDailyWashes } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { formatReportMoney, sumReportTotal } from '../../helpers'

const DailyWashes = () => (
  <ReportPage
    fetchReport={getDailyWashes}
    fields={['day', 'wash_count', 'total_cost', 'total_price']}
    headings={['Date', 'Quantity', 'Cost Price', 'Total']}
    transform={formatReportMoney}
    total={sumReportTotal}
  />
)

export default DailyWashes
