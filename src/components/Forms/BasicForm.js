import React from 'react'

const snakeToSpace = (input) => {
  input = input.replace('_', ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const inputs = (editableKeys, record, editMethod) => {
  return editableKeys.map((key) => {
    return (
      <div key={key}>
        <label>{snakeToSpace(key)}</label>
        <input
          onChange={(e) => editMethod(record, key, e.target.value)}
          className="form-control"
          value={record[key]}
        ></input>
      </div>
    )
  })
}

const BasicForm = (props) => {
  return (
    <>
      {inputs(props.editableKeys, props.record, props.editRecordMethod)}
      <button onClick={(e) => props.saveFormData()}>Button</button>
    </>
  )
}

export default BasicForm
