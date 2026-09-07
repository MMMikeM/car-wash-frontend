import React from 'react'
import {
  getWashesReport,
  getWashesReportDownload,
} from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { formatReportMoney, handleDownload, sumReportTotal } from '../../helpers'

const WashesReport = () => (
  <ReportPage
    fetchReport={getWashesReport}
    fields={['name', 'wash_count', 'total_cost', 'total_price']}
    headings={['name', 'Quantity', 'Cost Price', 'Total']}
    transform={formatReportMoney}
    total={sumReportTotal}
    onDownload={async (startDate, endDate) => {
      let res = await getWashesReportDownload(startDate, endDate)
      handleDownload(res, 'WashReport')
    }}
  />
)

export default WashesReport
