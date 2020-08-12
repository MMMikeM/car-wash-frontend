import React from 'react'

const snakeToSpace = (input) => {
  input = input.replace(/_/g, ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const inputs = (editableKeys, record, updateValueMethod, transformations) => {
  return editableKeys.map((key, index) => {
    let value = record[key]
    if (transformations[index] !== '') {
      value = transformations[index](value)
    }

    return (
      <div className="mb-2" key={key}>
        <label className="text-9">{snakeToSpace(key)}</label>
        <input
          onChange={(e) => updateValueMethod(record, key, e.target.value)}
          className="form-control bg-2 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
          value={value}
        ></input>
      </div>
    )
  })
}

const BasicForm = (props) => {
  return (
    <div>
      {inputs(
        props.editableKeys,
        props.record,
        props.editRecordMethod,
        props.valueTransformations
      )}
      <button
        className="btn btn-primary px-5 mx-auto"
        onClick={() => props.saveFormData()}
      >
        Save
      </button>
    </div>
  )
}

export default BasicForm
