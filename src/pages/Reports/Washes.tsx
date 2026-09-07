import React from 'react'
import {
  getWashesReport,
  getWashesReportDownload,
} from '../../services/reportsApi'
import ReportPage from '../../components/Reports/ReportPage'
import { reportError } from '@/lib/reportError'
import { formatReportMoney, handleDownload, sumReportTotal } from '../../helpers'

const WashesReport = () => (
  <ReportPage
    fetchReport={getWashesReport}
    fields={['name', 'wash_count', 'total_cost', 'total_price']}
    headings={['name', 'Quantity', 'Cost Price', 'Total']}
    transform={formatReportMoney}
    total={sumReportTotal}
    onDownload={async (startDate, endDate) => {
      try {
        let res = await getWashesReportDownload(startDate, endDate)
        handleDownload(res, 'WashReport')
      } catch (error) {
        reportError(error, 'download the report')
      }
    }}
  />
)

export default WashesReport
