import React, { useState, Suspense } from 'react'
import useSWR from 'swr'
import BasicTable from '../Tables/BasicTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '../../helpers'
import { ListSkeleton } from '../Loading'

/** Module scope, so omitting the prop does not hand down a new function. */
const identity = (rows) => rows

const ReportPageContent = ({
  fetchReport,
  fields,
  headings,
  transform = identity,
  total = null,
  onDownload = null,
  showFilters = true,
  heading = null,
  initialStartDate = formatDate(new Date()),
}) => {
  const todayValue = formatDate(new Date())
  let [startDate, setStartDate] = useState(initialStartDate)
  let [endDate, setEndDate] = useState(todayValue)

  // The applied range is separate from the inputs, so editing a date does not
  // refetch until Generate is pressed.
  const [applied, setApplied] = useState({
    from: initialStartDate,
    to: todayValue,
  })

  const { data: reportData } = useSWR(
    ['report', fetchReport.name, applied.from, applied.to],
    () => fetchReport(applied.from, applied.to),
    { keepPreviousData: true }
  )

  const mainTotal = total ? total(reportData) : ''
  const rows = transform(reportData)

  return (
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
            <Button onClick={() => setApplied({ from: startDate, to: endDate })}>
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
          records={rows}
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

const ReportPage = (props: React.ComponentProps<typeof ReportPageContent>) => (
  <Suspense
    fallback={
      <ListSkeleton rows={6} columns={4} actions={false} label="Loading the report" />
    }
  >
    <ReportPageContent {...props} />
  </Suspense>
)

export default ReportPage
