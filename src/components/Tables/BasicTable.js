import React from 'react'
import { Link } from 'react-router-dom'

const column = (property, key) => {
  return <td key={key}>{property}</td>
}

const buttonColumn = (button, key) => {
  return <td key={key}>{button}</td>
}

const row = (rowType, element, properties, key) => {
  let buttons = [<Link to={`/${rowType}/${element.id}/edit`}>edit</Link>]
  return (
    <tr key={key}>
      {properties.map((property, key) => {
        if (property.includes('/')) {
          let [a, b] = property.split('/')
          let content = element[a].map((row) => row[b]).join(',')
          return column(content, key)
        } else return column(element[property], key)
      })}
      {buttons.map((button, key) => buttonColumn(button, key))}
    </tr>
  )
}

const BasicTable = (props) => {
  return (
    <table className="table table-striped table-dark table-hover">
      <tbody>
        {props.records.map((record, key) =>
          row(props.rowType, record, props.headings, key)
        )}
      </tbody>
    </table>
  )
}

export default BasicTable
