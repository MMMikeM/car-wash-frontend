import React, { useState, useEffect, useCallback } from 'react'
import { Info, SquarePen, Trash2 } from 'lucide-react'
import { getWashes, deleteWash } from '../../services/washTypesApi'
import { Link } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers'
import { reportError } from '@/lib/reportError'
import { toast } from '@/components/ui/toast'
import { WashListSkeleton } from '../../components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmDialog from '../../components/ConfirmDialog'

const WashCard = ({ wash, onDelete }) => {
  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{wash.name}</h3>
            <span className="text-xs text-muted-foreground">Order: {wash.order}</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">{wash.price}</div>
            <div className="text-xs text-muted-foreground">Cost: {wash.cost}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">Points: </span>
            <span className="font-medium">{wash.points || 0}</span>
          </div>

          <div className="flex gap-1">
            <Link to={`/wash_types/${wash.id}`}>
              <Button variant="ghost" size="icon-sm" className="text-primary" aria-label="View wash type">
                <Info />
              </Button>
            </Link>
            <Link to={`/wash_types/${wash.id}/edit`}>
              <Button variant="ghost" size="icon-sm" className="text-primary" aria-label="Edit wash type">
                <SquarePen />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              aria-label="Delete wash type"
              onClick={() => onDelete(wash.id)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const WashTableRow = ({ wash, onDelete }) => {
  return (
    <tr className="border-b border-border hover:bg-muted/50">
      <td className="py-3 px-4 font-medium">{wash.name}</td>
      <td className="py-3 px-4 text-muted-foreground">{wash.cost}</td>
      <td className="py-3 px-4 font-semibold text-primary">{wash.price}</td>
      <td className="py-3 px-4">{wash.points || 0}</td>
      <td className="py-3 px-4">{wash.order}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Link to={`/wash_types/${wash.id}`}>
            <Button variant="ghost" size="icon-xs" aria-label="View wash type">
              <Info />
            </Button>
          </Link>
          <Link to={`/wash_types/${wash.id}/edit`}>
            <Button variant="ghost" size="icon-xs" aria-label="Edit wash type">
              <SquarePen />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Delete wash type"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(wash.id)}
          >
            <Trash2 />
          </Button>
        </div>
      </td>
    </tr>
  )
}

const WashesIndex = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)
  let [modalIsVisible, setModalIsVisible] = useState(false)
  let [washToDelete, setWashToDelete] = useState<{ id: string; name: string }>()

  const reloadWashes = useCallback(async () => {
    try {
      let res = await getWashes()
      setWashes(transformWashesCentsToRands(res))
    } catch (error) {
      reportError(error, 'load the wash types')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // State is set after the await, not synchronously.
    // oxlint-disable-next-line react/set-state-in-effect
    reloadWashes()
  }, [reloadWashes])

  const requestDeleteWash = (washId) => {
    setWashToDelete(washes.find((wash) => wash.id === washId))
    setModalIsVisible(true)
  }

  const handleDeleteWash = async () => {
    setModalIsVisible(false)
    if (!washToDelete) return

    try {
      await deleteWash(washToDelete.id)
    } catch (error) {
      reportError(error, 'delete the wash type')
      return
    }
    toast.success('Wash type deleted')
    reloadWashes()
  }

  const sortedWashes = washes
    .filter((wash) => wash.free === false)
    .sort((a, b) => (a.order > b.order ? 1 : -1))

  if (loading) {
    return (
      <WashListSkeleton rows={9} label="Loading the wash types" />
    )
  }

  return (
    <div className="w-full">
      <ConfirmDialog
        open={modalIsVisible}
        onOpenChange={setModalIsVisible}
        onConfirm={handleDeleteWash}
        title="Delete wash type"
        description={`Are you sure you would like to delete ${
          washToDelete?.name ?? 'this wash type'
        }?`}
        confirmLabel="Delete"
        destructive
      />

      {/* Add button - full width like customers page */}
      <Link to="/wash_types/new" className="block mb-4">
        <Button className="w-full">Add Wash</Button>
      </Link>

      {/* Mobile: Card Layout */}
      <div className="md:hidden">
        {sortedWashes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No wash types yet. Add your first one!
            </CardContent>
          </Card>
        ) : (
          sortedWashes.map((wash) => (
            <WashCard key={wash.id} wash={wash} onDelete={requestDeleteWash} />
          ))
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Name</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Cost</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Price</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Points</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Order</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedWashes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No wash types yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  sortedWashes.map((wash) => (
                    <WashTableRow key={wash.id} wash={wash} onDelete={requestDeleteWash} />
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WashesIndex
