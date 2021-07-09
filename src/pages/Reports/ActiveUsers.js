import React, { useState, useEffect } from 'react'
import { getActiveUsersReport } from '../../services/reportsApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { centsToRands, formatRands, handleDownload } from '../../helpers'
import dayjs from 'dayjs'
//import { Link, useHistory } from 'react-router-dom'

const ActiveUsersReport = () => {
  let [reportData, setReportData] = useState([])
  let [startDate, setStartDate] = useState('')
  let [endDate, setEndDate] = useState('')
  // let [mainTotal, setMainTotal] = useState(0)
  let [loading, setLoading] = useState(true)

  const todaysDate = () => {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const threeMonthsBackDate = () => {
    var wayback = dayjs().subtract(7, 'month').format('YYYY-MM-DD')
    return(wayback)
  }

  const handleFetchReport = async () => {
    setLoading(true)
    let res = await getActiveUsersReport(startDate, endDate)
    setReportData(res)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    let localStartDate =  threeMonthsBackDate() 
    let localEndDate = todaysDate()
    setStartDate(localStartDate)
    setEndDate(localEndDate)
    getActiveUsersReport(localStartDate, localEndDate).then((res) => {
      setReportData(res)
      setLoading(false)
    })
  }, [])

  return loading ? (
    ''
  ) : (
      <div className="row">
        {/* <div className="col-md-3">
          <label className="text-white">Start Date</label>
          <input
            className="form-control"
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          />
        </div>
        <div className="form-group col-md-3">
          <label className="text-white">End Date</label>
          <input
            className="form-control"
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          />
        </div>
        <div className="form-group col-md-6 d-flex justify-content-end">
          <button
            className="btn btn-primary mt-4 mr-4 px-4 py-2"
            onClick={() => {
              handleFetchReport()
            }}
          >
            Generate Report
        </button>
        </div> */}
        <div className="col-md-12 mt-4">
          <BasicTable
            rowType={'customers'}
            records={reportData}
            fields={['name', 'contact_number']}
            headings={['name', 'contact_number']}
            crudEnabled={false}
            extraButtons={[]}
          />
        </div>
      </div>
    )
}

export default ActiveUsersReport
