import React, { useState, useEffect } from 'react'
import {
  getDailyWashesDetail
} from '../../services/reportsApi.js'
import BasicTable from '../../components/Tables/BasicTable'
import dayjs from 'dayjs'
import { centsToRands, formatRands, handleDownload } from '../../helpers'
//import { Link, useHistory } from 'react-router-dom'

const DailyWashesDetail = () => {
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



  const handleFetchReport = async () => {
    setLoading(true)
    // let localTotal = 0
    // let res = await getDailyWashesDetail(startDate, endDate)
    
    let tempArray = []
    getDailyWashesDetail(startDate, endDate).then((res) => {
    // eslint-disable-next-line
    res.map((item) => {
      let tempObject = item
      let date = new Date(item.created_at)
      tempObject.created_at = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      tempArray.push(tempObject)
    })
      setReportData(tempArray)
      setLoading(false)
    })
   }

  useEffect(() => {
    setLoading(true)
    let localStartDate = todaysDate()
    let localEndDate = todaysDate()
    setStartDate(localStartDate)
    setEndDate(localEndDate)
    let tempArray = []
    getDailyWashesDetail(localStartDate, localEndDate).then((res) => {
    // eslint-disable-next-line
    res.map((item) => {
      let tempObject = item
      let date = new Date(item.created_at)
      tempObject.created_at = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      tempArray.push(tempObject)
    })
      setReportData(tempArray)
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
        </div>
        <div className="col-md-12 mt-4">
          <BasicTable
            rowType={'customers'}
            records={reportData}
            fields={['wash_type_name', 'name', 'contact_number', 'created_at']}
            headings={['Wash', 'Name', 'Contact Number', 'Created Time']}
            crudEnabled={false}
            extraButtons={[]}
          />
        </div>
        <div className="col-md-6"></div>
        {/* <div className="col-md-6 mt-4 text-right">
          <h3 className="text-white">{`Total: ${mainTotal}`}</h3>
        </div> */}
      </div>
    )
}

export default DailyWashesDetail
