import React from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash, FaInfo } from 'react-icons/fa'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { useIsDesktop } from '@/lib/useMediaQuery'

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
    let regex = /[\d|a-f]{8}\b-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-\b[\d|a-f]{12}\b@carboncarwash.co.za/g
    if (regex.test(element.email)) {
      return 'No email provided'
    }
    return element[property]
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

const Actions = ({ rowType, element, deleteMethod }) => (
  <div className="flex items-center gap-1">
    <Link className={actionClass} to={`/${rowType}/${element.id}`}>
      <FaInfo />
    </Link>
    <Link className={actionClass} to={`/${rowType}/${element.id}/edit`}>
      <FaEdit />
    </Link>
    <a className={actionClass} onClick={() => deleteMethod(element.id)}>
      <FaTrash />
    </a>
  </div>
)

const BasicTable = ({
  rowType,
  records,
  fields,
  headings,
  extraButtons = [],
  crudEnabled = false,
  deleteMethod,
}) => {
  const rows = [...records].reverse()
  const isDesktop = useIsDesktop()

  // Narrow screens get a card per record: a four-column report scrolled
  // sideways is unusable on the phones the wash bay runs on.
  if (!isDesktop) {
    return (
      <div className="flex flex-col gap-3">
        {rows.map((element, key) => (
          <Card key={key} className="py-0">
            <CardContent className="flex flex-col gap-2 p-4">
              {fields.map((field, index) => (
                <div key={field} className="flex justify-between gap-4">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {heading(headings[index] ?? field)}
                  </span>
                  <span className="text-right">
                    {displayValue(element, field)}
                  </span>
                </div>
              ))}
              {(extraButtons.length > 0 || crudEnabled) && (
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    {/* Callers read the record id off the button's parentNode,
                        so each one needs the same wrapper the table cell gives
                        it. */}
                    {extraButtons.map((button, index) => (
                      <span key={index} id={element.id}>
                        {button}
                      </span>
                    ))}
                  </div>
                  {crudEnabled && (
                    <Actions
                      rowType={rowType}
                      element={element}
                      deleteMethod={deleteMethod}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full py-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {headings.map((value, key) => (
                <TableHead key={key}>{heading(value)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((element, key) => (
              <TableRow key={key}>
                {fields.map((field, index) => (
                  <TableCell key={index}>
                    {displayValue(element, field)}
                  </TableCell>
                ))}
                {extraButtons.map((button, index) => (
                  <TableCell key={index} id={element.id}>
                    {button}
                  </TableCell>
                ))}
                {crudEnabled && (
                  <TableCell>
                    <Actions
                      rowType={rowType}
                      element={element}
                      deleteMethod={deleteMethod}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </CardContent>
    </Card>
  )
}

export default BasicTable
