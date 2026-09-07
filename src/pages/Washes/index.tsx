import React, { useState, useEffect } from 'react'
import { getWashes, deleteWash } from '../../services/washTypesApi'
import { Link } from 'react-router-dom'
import { transformWashesCentsToRands } from '../../helpers'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FaEdit, FaTrash, FaInfo, FaPlus } from 'react-icons/fa'

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
                <FaInfo />
              </Button>
            </Link>
            <Link to={`/wash_types/${wash.id}/edit`}>
              <Button variant="ghost" size="icon-sm" className="text-primary" aria-label="Edit wash type">
                <FaEdit />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              aria-label="Delete wash type"
              onClick={() => onDelete(wash.id)}
            >
              <FaTrash />
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
              <FaInfo />
            </Button>
          </Link>
          <Link to={`/wash_types/${wash.id}/edit`}>
            <Button variant="ghost" size="icon-xs" aria-label="Edit wash type">
              <FaEdit />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Delete wash type"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(wash.id)}
          >
            <FaTrash />
          </Button>
        </div>
      </td>
    </tr>
  )
}

const WashesIndex = () => {
  let [washes, setWashes] = useState([])
  let [loading, setLoading] = useState(true)

  const handleFetchWashes = async () => {
    let res = await getWashes()
    let transformedWashes = transformWashesCentsToRands(res)
    setWashes(transformedWashes)
    setLoading(false)
  }

  useEffect(() => {
    handleFetchWashes()
  }, [])

  const handleDeleteWash = async (washId) => {
    let mustDeletewash = window.confirm(
      'Are you sure you want to delete this Wash Option?'
    )

    if (mustDeletewash) {
      setLoading(!loading)
      await deleteWash(washId)
      handleFetchWashes()
    }
  }

  const sortedWashes = washes
    .filter((wash) => wash.free === false)
    .sort((a, b) => (a.order > b.order ? 1 : -1))

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
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
            <WashCard key={wash.id} wash={wash} onDelete={handleDeleteWash} />
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
                    <WashTableRow key={wash.id} wash={wash} onDelete={handleDeleteWash} />
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
