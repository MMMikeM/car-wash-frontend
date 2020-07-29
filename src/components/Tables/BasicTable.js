import React from 'react'
import { Link } from 'react-router-dom'
import edit from '../../images/edit.svg'
import { FaEdit } from 'react-icons/fa'

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

const row = (rowType, element, properties, key, extraButtons = []) => {
  let buttons = [
    ...extraButtons,
    <Link className="px-2 mt-n1" to={`/${rowType}/${element.id}/edit`}>
      <FaEdit />
    </Link>,
  ]
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
    </tr>
  )
}

const BasicTable = (props) => {
  return (
    <table className="table text-9 ">
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
          row(props.rowType, record, props.headings, key, props.extraButtons)
        )}
      </tbody>
    </table>
  )
}

export default BasicTable
