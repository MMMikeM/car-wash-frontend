import React, {useState, useEffect} from 'react'
import BasicForm from '../../components/Forms/BasicForm'
import { useHistory } from 'react-router-dom'


const Settings = () => {
    let [freeWashPoints, setFreeWashPoints] = useState(0)
    let [loading, setLoading] = useState(false)
    const history = useHistory()

    // useEffect(() => {
    //     const handleFetchFreeWash = async () => {
    //       let res = await getFreePoints()
    //       setFreeWashPoints(res)
    //       setLoading(false)
    //     }
    //     handleFetchFreeWash()
    //   }, [])


    // const save = async () => {
    //     setLoading(true)
    //     // eslint-disable-next-line no-unused-vars
    //     let res = await postFreeWashPoints(freeWashPoints)
    //     setLoading(false)
    //     history.push(`/settings`)
    // }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    tempRecord[key] = value
    setFreeWashPoints(tempRecord)
  }


    return (
      <h1>hi</h1>
      //   <BasicForm
      //   editRecordMethod={editRecordMethod}
      //   record={freeWashPoints}
      //   saveFormData={save}
      //   editableKeys={['points']}
      //   valueTransformations={['']}
      // />
    )
}

export default Settings
