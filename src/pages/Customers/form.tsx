import React from 'react'
import { customerSchema } from '../../lib/schemas'
import BasicForm from '../../components/Forms/BasicForm'

export const schema = customerSchema

export const CustomerForm = (props) => {
  return (
    <BasicForm
      editRecordMethod={props.editRecordMethod}
      record={props.localCustomer}
      saveFormData={props.save}
      saving={props.saving}
      editableKeys={['name', 'email', 'contact_number', 'total_points', 'loyalty_enabled']}
      valueTransformations={['', '', '', '', '']}
      inputTypes={['text', 'email', 'text', 'number', 'checkbox']}
    />
  )
}
