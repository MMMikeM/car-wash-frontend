import React from 'react'

const snakeToSpace = (input) => {
  input = input.replace('_', ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const inputs = (editableKeys, record, editMethod) => {
  return editableKeys.map((key) => {
    return (
      <div className="mb-2" key={key}>
        <label className="text-9">{snakeToSpace(key)}</label>
        <input
          onChange={(e) => editMethod(record, key, e.target.value)}
          className="form-control bg-2 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
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
      <button
        className="btn btn-primary px-5 mx-auto"
        onClick={(e) => props.saveFormData()}
      >
        Save
      </button>
    </>
  )
}

export default BasicForm
