import React from 'react'

const snakeToSpace = (input) => {
  input = input.replace(/_/g, ' ')
  input = input.charAt(0).toUpperCase() + input.slice(1)
  return input
}

const inputs = (
  editableKeys,
  record,
  updateValueMethod,
  transformations,
  inputTypes = []
) => {
  return editableKeys.map((key, index) => {
    let value = record[key]
    if (transformations[index] !== '') {
      value = transformations[index](value)
    }

    return inputTypes[index] == 'checkbox' ? (
      <div key={key} className="form-check mt-4 mb-3  text-9">
        <input
          onChange={(e) => updateValueMethod(record, key, !value)}
          checked={value}
          className="form-check-input"
          type="checkbox"
          // value={value}
          id="defaultCheck1"
        />
        <label className="form-check-label mb-2" htmlFor="defaultCheck1">
          Opt in for Carbon Car Wash marketing
        </label>
        <h6 className="text-6 mt-3">
          Carbon Car Wash values your privacy and will not share or sell your
          data.
        </h6>
      </div>
    ) : (
      <div className="form-group" key={key}>
        <label className="text-9">{snakeToSpace(key)}</label>
        <input
          type={inputTypes[index]}
          onChange={(e) => updateValueMethod(record, key, e.target.value)}
          className="form-control bg-3 border-0 text-6 mb-3 border-bottom rounded-0 border-primary"
          value={value}
        ></input>
      </div>
    )
  })
}

const BasicForm = (props) => {
  return (
    <div className="bg-3 px-4 py-4 rounded">
      <div className="px-3 pb-3 pt-2">
        {inputs(
          props.editableKeys,
          props.record,
          props.editRecordMethod,
          props.valueTransformations,
          props.inputTypes
        )}
        <div className="d-flex flex-row justify-content-end">
          <button
            className="btn btn-primary py-2 mt-4 w-100"
            onClick={() => props.saveFormData()}
          >
            {props.buttonName ? props.buttonName : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BasicForm
