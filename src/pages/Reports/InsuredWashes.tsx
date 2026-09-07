import React from 'react'
import { getInsuredWashes } from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { formatReportMoney, sumReportTotal } from '../../helpers'

const InsuredWashes = () => (
  <ReportPage
    fetchReport={getInsuredWashes}
    fields={['day', 'wash_count', 'total_cost', 'total_price']}
    headings={['Date', 'Quantity', 'Cost Price', 'Total']}
    transform={formatReportMoney}
    total={sumReportTotal}
  />
)

export default InsuredWashes
