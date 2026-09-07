import React, { useState, useEffect } from 'react'
import { getWash } from '../../services/washTypesApi.js'
import { useParams, Link } from 'react-router-dom'
import { transformCentsToRands } from '../../helpers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'

const WashShow = () => {
  let [localWash, setLocalWash] = useState({})
  let [loading, setLoading] = useState(true)

  let { id } = useParams()

  useEffect(() => {
    const handleFetchWash = async () => {
      let res = await getWash(id)
      setLocalWash(res)
      setLoading(false)
    }
    handleFetchWash()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{localWash.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {localWash.description && (
            <p className="text-muted-foreground mb-4">{localWash.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Cost</span>
              <span className="font-medium">{transformCentsToRands(localWash.cost)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Selling Price</span>
              <span className="font-semibold text-lg text-primary">
                {transformCentsToRands(localWash.price)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Points Awarded</span>
              <span className="font-medium">{localWash.points || 0}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Display Order</span>
              <span className="font-medium">{localWash.order}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-border">
            <Link to="/wash_types" className="flex-1">
              <Button variant="outline" className="w-full">
                <FaArrowLeft className="mr-2" />
                Back to Washes
              </Button>
            </Link>
            <Link to={`/wash_types/${id}/edit`} className="flex-1">
              <Button className="w-full">
                <FaEdit className="mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WashShow
