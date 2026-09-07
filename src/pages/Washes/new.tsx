import React, { useState } from 'react'
import { postWash } from '../../services/washTypesApi'
import { WashForm, schema } from './form'
import { useHistory, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaArrowLeft } from 'react-icons/fa'

const WashNew = () => {
  let [newWash, setNewWash] = useState({
    name: '',
    cost: '',
    price: '',
    points: '',
    description: '',
  })

  let [loading, setLoading] = useState(false)

  const history = useHistory()

  const save = async () => {
    let valid = await schema.validate(newWash).catch((err) => {
      alert(err.errors)
    })
    if (valid) {
      setLoading(true)
      let res = await postWash(newWash)
      setLoading(false)
      history.push(`/wash_types/${res.id}`)
    }
  }

  const editRecordMethod = (record, key, value) => {
    let tempRecord = { ...record }
    if (['price', 'cost'].includes(key)) {
      tempRecord[key] = value * 100
    } else {
      tempRecord[key] = value
    }
    setNewWash(tempRecord)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <Link to="/wash_types">
          <Button variant="ghost" size="sm">
            <FaArrowLeft className="mr-2" />
            Back to Washes
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Wash Type</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading ? (
            <WashForm
              editRecordMethod={editRecordMethod}
              record={newWash}
              save={save}
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Saving...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WashNew
