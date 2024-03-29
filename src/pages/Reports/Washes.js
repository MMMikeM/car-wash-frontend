import React, { useState, useEffect } from 'react'
import { getWashesReport } from '../../services/reportsApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import { centsToRands, formatRands } from '../../helpers'
//import { Link, useHistory } from 'react-router-dom'

const WashesReport = () => {
  let [reportData, setReportData] = useState([])
  let [startDate, setStartDate] = useState('')
  let [endDate, setEndDate] = useState('')
  let [mainTotal, setMainTotal] = useState(0)
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

  const handleFetchReport = async () => {
    setLoading(true)
    let localTotal = 0
    let res = await getWashesReport(startDate, endDate)
    setReportData(res)
    res.map((washType) => {
      localTotal += parseFloat(washType.total_price)
      washType.total_cost = formatRands(centsToRands(washType.total_cost))
      washType.total_price = formatRands(centsToRands(washType.total_price))
    })
    setMainTotal(formatRands(centsToRands(localTotal)))
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    let localStartDate = todaysDate()
    let localEndDate = todaysDate()
    let localTotal = 0
    setStartDate(localStartDate)
    setEndDate(localEndDate)
    getWashesReport(localStartDate, localEndDate).then((res) => {
      setReportData(res)
      res.map((washType) => {
        localTotal += parseFloat(washType.total_price)
        washType.total_cost = formatRands(centsToRands(washType.total_cost))
        washType.total_price = formatRands(centsToRands(washType.total_price))
      })
      setMainTotal(formatRands(centsToRands(localTotal)))
      setLoading(false)
    })
  }, [])

  return loading ? (
    ''
  ) : (
    <div className="row">
      <div className="col-md-3">
        <label className="text-white">Start Date</label>
        <input
          class="form-control"
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
        />
      </div>
      <div className="form-group col-md-3">
        <label className="text-white">End Date</label>
        <input
          class="form-control"
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
        />
      </div>
      <div className="form-group col-md-6">
        <button
          className="btn btn-primary mt-4 px-4"
          onClick={() => {
            handleFetchReport()
          }}
        >
          Generate Report
        </button>
      </div>
      <div className="col-md-12 mt-4">
        <BasicTable
          rowType={'customers'}
          records={reportData}
          fields={['name', 'wash_count', 'total_cost', 'total_price']}
          headings={['name', 'Quantity', 'Cost', 'Total']}
          crudEnabled={false}
          extraButtons={[]}
        />
      </div>
      <div className="col-md-6"></div>
      <div className="col-md-6 mt-4 text-right">
        <h3 className="text-white">{`Total: ${mainTotal}`}</h3>
      </div>
    </div>
  )
}

export default WashesReport
