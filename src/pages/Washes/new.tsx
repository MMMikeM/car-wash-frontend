import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { postWash } from '../../services/washTypesApi'
import { WashForm, schema } from './form'
import { useHistory, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { validate } from '../../lib/validate'
import { reportError } from '@/lib/reportError'

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
    let valid = validate(schema, newWash)
    if (valid) {
      setLoading(true)
      try {
        let res = await postWash(newWash)
        history.push(`/wash_types/${res.id}`)
      } catch (error) {
        reportError(error, 'create the wash type')
      } finally {
        setLoading(false)
      }
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
            <ArrowLeft className="mr-2" />
            Back to Washes
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Wash Type</CardTitle>
        </CardHeader>
        <CardContent>
          <WashForm
            editRecordMethod={editRecordMethod}
            record={newWash}
            save={save}
            saving={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default WashNew
