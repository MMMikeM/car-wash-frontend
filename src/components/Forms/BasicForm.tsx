import React from 'react'
import { Button } from '@/components/ui/button'

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

    return inputTypes[index] === 'checkbox' ? (
      <div key={key} className="flex items-center space-x-2 py-3">
        <input
          onChange={(e) => updateValueMethod(record, key, !value)}
          checked={value}
          className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-background"
          type="checkbox"
          id={`checkbox-${key}`}
        />
        <label
          className="text-sm font-medium text-foreground cursor-pointer"
          htmlFor={`checkbox-${key}`}
        >
          {snakeToSpace(key)}
        </label>
      </div>
    ) : (
      <div className="mb-4" key={key}>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          {snakeToSpace(key)}
        </label>
        <input
          type={inputTypes[index] || 'text'}
          onChange={(e) => updateValueMethod(record, key, e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          value={value || ''}
          placeholder={`Enter ${snakeToSpace(key).toLowerCase()}`}
        />
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
        props.valueTransformations,
        props.inputTypes
      )}
      <Button
        className="w-full mt-4"
        onClick={() => props.saveFormData()}
      >
        {props.buttonName ? props.buttonName : 'Save'}
      </Button>
    </div>
  )
}

export default BasicForm
