import React from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash, FaInfo } from 'react-icons/fa'

const column = (property, key) => {
  return <td key={key}>{property}</td>
}

const buttonColumn = (button, key, id) => {
  return (
    <td key={key} id={id}>
      {button}
    </td>
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
    <tr key={key}>
      {properties.map((property, key) => {
        if (property.includes('/')) {
          let [a, b] = property.split('/')
          let content = element[a].map((row) => row[b]).join(',')
          return column(content, key)
        } else return column(element[property], key)
      })}
      {buttons.map((button, key) => buttonColumn(button, key, element['id']))}
      {crudEnabled ? (
        <td>
          <Link className="px-2 mt-n1" to={`/${rowType}/${element.id}`}>
            <FaInfo />
          </Link>
          <Link className="px-2 mt-n1" to={`/${rowType}/${element.id}/edit`}>
            <FaEdit />
          </Link>
            <a className="px-2 mt-n1" onClick={() => deleteMethod(element.id)}>
            <FaTrash />
          </a>
        </td>
      ) : (
        ''
      )}
    </tr>
  )
}

const BasicTable = (props) => {
  return (
    <table className="table text-9">
      <thead>
        <tr>
          {props.headings.map((heading, key) => {
            if (heading.includes('/')) {
              return <th key={key}>{snakeToSpace(heading).split('/')[0]}</th>
            } else {
              return <th key={key}>{snakeToSpace(heading)}</th>
            }
          })}
        </tr>
      </thead>
      <tbody>
        {props.records.map((record, key) =>
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
      </tbody>
    </table>
  )
}

export default BasicTable
