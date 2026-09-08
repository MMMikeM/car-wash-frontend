import React, { Suspense } from 'react'
import useSWR from 'swr'
import { ArrowLeft, SquarePen } from 'lucide-react'
import { getWash } from '../../services/washTypesApi'
import { DetailSkeleton } from '../../components/Loading'
import { useParams, Link } from 'react-router-dom'
import { transformCentsToRands } from '../../helpers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WashShowContent = () => {
  let { id } = useParams()

  const { data } = useSWR(['the wash type', id], () => getWash(id))
  const localWash = data


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
                <ArrowLeft className="mr-2" />
                Back to Washes
              </Button>
            </Link>
            <Link to={`/wash_types/${id}/edit`} className="flex-1">
              <Button className="w-full">
                <SquarePen className="mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const WashShow = () => (
  <Suspense fallback={<DetailSkeleton rows={4} label="Loading the wash type" />}>
    <WashShowContent />
  </Suspense>
)

export default WashShow
