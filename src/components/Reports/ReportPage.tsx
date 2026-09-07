import React, { useEffect, useState } from 'react'
import BasicTable from '../Tables/BasicTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const todaysDate = () => {
  let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

const ReportPage = ({
  fetchReport,
  fields,
  headings,
  transform = (rows) => rows,
  total = null,
  onDownload = null,
  showFilters = true,
  heading = null,
  initialStartDate = todaysDate(),
}) => {
  let [reportData, setReportData] = useState([])
  let [startDate, setStartDate] = useState(initialStartDate)
  let [endDate, setEndDate] = useState(todaysDate())
  let [mainTotal, setMainTotal] = useState('')
  let [loading, setLoading] = useState(true)

  const load = (from, to) => {
    setLoading(true)
    fetchReport(from, to).then((res) => {
      if (total) {
        setMainTotal(total(res))
      }
      setReportData(transform(res))
      setLoading(false)
    })
  }

  useEffect(() => {
    load(startDate, endDate)
  }, [])

  return loading ? (
    ''
  ) : (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-4">
      {showFilters ? (
        <>
          <div>
            <label className="text-white">Start Date</label>
            <Input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
          </div>
          <div>
            <label className="text-white">End Date</label>
            <Input
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
          rowType={'customers'}
          records={reportData}
          fields={fields}
          headings={headings}
          crudEnabled={false}
          extraButtons={[]}
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
