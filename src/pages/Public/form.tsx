import React from 'react'
import BasicForm from '../../components/Forms/BasicForm'

export const SignUpForm = (props) => {
  return (
    <BasicForm
      editRecordMethod={props.editRecordMethod}
      record={props.localCustomer}
      saveFormData={props.save}
      editableKeys={[
        'name',
        'email',
        'contact_number',
        'password',
        'password_confirmation',
        'opted_for_marketing',
      ]}
      valueTransformations={['', '', '', '', '', '']}
      inputTypes={['', '', '', 'password', 'password', 'checkbox']}
      buttonName={'Sign Up'}
    />
  )
}
