import React from 'react'
import * as v from 'valibot'
import BasicForm from '../../components/Forms/BasicForm'
import { centsToRands } from '../../helpers'


// The form feeds these in as strings, and a bare coercion reads '' as 0, so
// empty input is rejected before the transform rather than saved as a 0 price.
const numeric = v.pipe(
  v.union([
    v.number(),
    v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, 'Please enter a number')),
  ]),
  v.transform(Number)
)

export const schema = v.object({
  name: v.pipe(
    v.string('Please enter a valid name'),
    v.minLength(1, 'Please enter a valid name')
  ),
  cost: v.optional(numeric),
  price: numeric,
  points: v.optional(numeric),
  description: v.optional(v.string()),
})


export const WashForm = (props) => {
    return (         
    <BasicForm
        editRecordMethod={props.editRecordMethod}
        record={props.record}
        saveFormData={props.save}
      saving={props.saving}
        editableKeys={['name', 'cost', 'price', 'points', 'description']}
        valueTransformations={['', centsToRands, centsToRands, '', '', '']}
      />
    )
}




