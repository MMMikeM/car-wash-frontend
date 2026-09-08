import React from 'react'
import { Info, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { isAnonymousEmail } from '../../helpers'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const actionClass =
  'rounded-md p-2 text-muted-foreground! no-underline! transition-colors hover:bg-accent hover:text-primary! cursor-pointer'

const snakeToSpace = (input) => {
  input = input.replace('_', ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const heading = (input) =>
  input.includes('/') ? snakeToSpace(input).split('/')[0] : snakeToSpace(input)

// A field may name a nested collection as "vehicles/registration_number", which
// lists the values up to a count the row can show and says "Multiple" past it.
const displayValue = (element, property) => {
  if (property === 'email') {
    return isAnonymousEmail(element.email) ? 'No email provided' : element[property]
  }

  if (property.includes('/')) {
    let [collection, field] = property.split('/')
    if (element[collection]?.length < 3) {
      return element[collection]
        .map((row) => row[field])
        .filter(Boolean)
        .join(', ')
        .toUpperCase()
    }
    return 'Multiple'
  }

  let value = element[property]
  return Array.isArray(value) ? snakeToSpace(value[0]) : value
}

export const CrudActions = ({ rowType, record, onDelete }) => (
  <>
    <Link className={actionClass} to={`/${rowType}/${record.id}`}>
      <Info />
      <span className="sr-only">View details</span>
    </Link>
    <Link className={actionClass} to={`/${rowType}/${record.id}/edit`}>
      <SquarePen />
      <span className="sr-only">Edit</span>
    </Link>
    <Button
      variant="ghost"
      className={cn('h-auto', actionClass)}
      onClick={() => onDelete(record.id)}
    >
      <Trash2 />
      <span className="sr-only">Delete</span>
    </Button>
  </>
)

const BasicTable = ({ records, fields, headings, renderActions = null }) => {
  const rows = [...records].reverse()

  return (
    <>
      {/* Narrow screens get a card per record: a four-column report scrolled
          sideways is unusable on the phones the wash bay runs on. */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((record, key) => (
          <Card key={key} className="py-0">
            <CardContent className="flex flex-col gap-2 p-4">
              {fields.map((field, index) => (
                <div key={field} className="flex justify-between gap-4">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {heading(headings[index] ?? field)}
                  </span>
                  <span className="text-right">
                    {displayValue(record, field)}
                  </span>
                </div>
              ))}
              {renderActions && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  {renderActions(record)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden w-full py-0 md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {headings.map((value, key) => (
                  <TableHead key={key}>{heading(value)}</TableHead>
                ))}
                {renderActions && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((record, key) => (
                <TableRow key={key}>
                  {fields.map((field, index) => (
                    <TableCell key={index}>
                      {displayValue(record, field)}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderActions(record)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
      </Card>
    </>
  )
}

export default BasicTable
