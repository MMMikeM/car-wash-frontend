import React, { useEffect, useState } from 'react'
import BasicTable from '../Tables/BasicTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '../../helpers'
import { ListSkeleton } from '../Loading'
import { reportError } from '@/lib/reportError'

const ReportPage = ({
  fetchReport,
  fields,
  headings,
  transform = (rows) => rows,
  total = null,
  onDownload = null,
  showFilters = true,
  heading = null,
  initialStartDate = formatDate(new Date()),
}) => {
  let [reportData, setReportData] = useState([])
  let [startDate, setStartDate] = useState(initialStartDate)
  let [endDate, setEndDate] = useState(formatDate(new Date()))
  let [mainTotal, setMainTotal] = useState('')
  let [loading, setLoading] = useState(true)

  const load = async (from, to) => {
    setLoading(true)
    try {
      const res = await fetchReport(from, to)
      if (total) {
        setMainTotal(total(res))
      }
      setReportData(transform(res))
    } catch (error) {
      reportError(error, 'load the report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(startDate, endDate)
  }, [])

  return loading ? (
    <ListSkeleton rows={6} columns={4} actions={false} label="Loading the report" />
  ) : (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-4">
      {showFilters ? (
        <>
          <div>
            <label className="text-white" htmlFor="report-start-date">
              Start Date
            </label>
            <Input
              id="report-start-date"
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
          </div>
          <div>
            <label className="text-white" htmlFor="report-end-date">
              End Date
            </label>
            <Input
              id="report-end-date"
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row md:col-span-2 md:mt-6 md:justify-end">
            <Button onClick={() => load(startDate, endDate)}>
              Generate Report
            </Button>
            {onDownload ? (
              <Button
                variant="outline"
                onClick={() => onDownload(startDate, endDate)}
              >
                Download Report
              </Button>
            ) : null}
          </div>
        </>
      ) : null}

      {heading ? (
        <div className="mb-4 md:col-span-4">
          <h4 className="text-white">{heading}</h4>
        </div>
      ) : null}

      <div className="mt-6 md:col-span-4">
        <BasicTable
          records={reportData}
          fields={fields}
          headings={headings}
        />
      </div>

      {total ? (
        <div className="mt-6 text-right md:col-span-4">
          <h3 className="text-white">{`Total: ${mainTotal}`}</h3>
        </div>
      ) : null}
    </div>
  )
}

export default ReportPage
