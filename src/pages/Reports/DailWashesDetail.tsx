import React, { useState, useEffect } from 'react'
import {
  getDailyWashesDetail
} from '../../services/reportsApi'
import BasicTable from '../../components/Tables/BasicTable'
import dayjs from 'dayjs'
import { centsToRands, formatRands, handleDownload } from '../../helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { hasRole } from '@/lib/auth'
//import { Link, useHistory } from 'react-router-dom'

const DailyWashesDetail = () => {
  let [reportData, setReportData] = useState([])
  let [startDate, setStartDate] = useState('')
  let [endDate, setEndDate] = useState('')
  // let [mainTotal, setMainTotal] = useState(0)
  let [loading, setLoading] = useState(true)

  const isManager = hasRole('manager')

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
        {isManager && (
          <>
            <div className="col-md-3">
              <label className="text-white">Start Date</label>
              <Input
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
            </div>
            <div className="form-group col-md-3">
              <label className="text-white">End Date</label>
              <Input
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
              />
            </div>
            <div className="form-group col-md-6 flex justify-end">
              <Button
                className="mt-4 mr-4 px-4 py-2"
                onClick={() => {
                  handleFetchReport()
                }}
              >
                Generate Report
              </Button>
            </div>
          </>
        )}
        {!isManager && (
          <div className="col-md-12 mb-3">
            <h4 className="text-white">Today's Washes</h4>
          </div>
        )}
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
