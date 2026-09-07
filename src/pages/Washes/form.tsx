import React from 'react'
import { z } from 'zod'
import BasicForm from '../../components/Forms/BasicForm'
import { centsToRands } from '../../helpers'


// The form feeds these in as strings, and z.coerce.number() reads '' as 0,
// so empty input is rejected before coercion rather than saved as a 0 price.
const numeric = z
  .union([z.number(), z.string().regex(/^-?\d+(\.\d+)?$/, 'Please enter a number')])
  .pipe(z.coerce.number())

export const schema = z.object({
  name: z.string({ error: 'Please enter a valid name' }).min(1, 'Please enter a valid name'),
  cost: numeric.optional(),
  price: numeric,
  points: numeric.optional(),
  description: z.string().optional(),
})


export const WashForm = (props) => {
    return (         
    <BasicForm
        editRecordMethod={props.editRecordMethod}
        record={props.record}
        saveFormData={props.save}
        editableKeys={['name', 'cost', 'price', 'points', 'description']}
        valueTransformations={['', centsToRands, centsToRands, '', '', '']}
      />
    )
}




