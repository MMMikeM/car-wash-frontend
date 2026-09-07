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

const column = (property, key) => {
  if (Array.isArray(property)) {
    return <TableCell key={key}>{snakeToSpace(property[0])}</TableCell>
  }
  return <TableCell key={key}>{property}</TableCell>
}

const buttonColumn = (button, key, id) => {
  return (
    <TableCell key={key} id={id}>
      {button}
    </TableCell>
  )
}

const snakeToSpace = (input) => {
  input = input.replace('_', ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const row = (
  rowType,
  element,
  properties,
  key,
  extraButtons = [],
  crudEnabled = false,
  deleteMethod
) => {
  let buttons = [...extraButtons]

  return (
    <TableRow
      key={key}
      className="border-0 bg-[var(--grey-3)] hover:bg-[var(--grey-4)] [&>td:first-of-type]:pl-6 [&_a:hover]:bg-[var(--grey-4)]"
    >
      {properties.map((property, key) => {
        if (property === 'email') {
          let regex = /[\d|a-f]{8}\b-[\d|a-f]{4}-[\d|a-f]{4}-[\d|a-f]{4}-\b[\d|a-f]{12}\b@carboncarwash.co.za/g
          if (regex.test(element.email)) {
            return column('No email provided', key)
          } else return column(element[property], key)
        } else if (property.includes('/')) {
          let [a, b] = property.split('/')
          if (element[a]?.length < 3) {
            let content = element[a]
              .map((row) => row[b])
              .filter(Boolean)
              .join(', ')
              .toUpperCase()
            return column(content, key)
          } else return column('Multiple', key)
        } else return column(element[property], key)
      })}
      {buttons.map((button, key) => buttonColumn(button, key, element['id']))}
      {crudEnabled ? (
        <TableCell>
          <Link className="px-2 mt-n1" to={`/${rowType}/${element.id}`}>
            <FaInfo />
          </Link>
          <Link className="px-2 mt-n1" to={`/${rowType}/${element.id}/edit`}>
            <FaEdit />
          </Link>
          <a className="px-2 mt-n1" onClick={() => deleteMethod(element.id)}>
            <FaTrash />
          </a>
        </TableCell>
      ) : (
          ''
        )}
    </TableRow>
  )
}

const BasicTable = (props) => {
  return (
    <Table className="text-9 border-separate border-spacing-y-[3px]">
      <TableHeader>
        <TableRow className="border-0 hover:bg-transparent [&>th:first-of-type]:pl-6">
          {props.headings.map((heading, key) => {
            if (heading.includes('/')) {
              return (
                <TableHead key={key}>
                  {snakeToSpace(heading).split('/')[0]}
                </TableHead>
              )
            } else {
              return <TableHead key={key}>{snakeToSpace(heading)}</TableHead>
            }
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.records.reverse().map((record, key) =>
          row(
            props.rowType,
            record,
            props.fields,
            key,
            props.extraButtons,
            props.crudEnabled,
            props.deleteMethod
          )
        )}
      </TableBody>
    </Table>
  )
}

export default BasicTable
