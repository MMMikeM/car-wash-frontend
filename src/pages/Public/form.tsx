import React from 'react'
import * as yup from 'yup'
import BasicForm from '../../components/Forms/BasicForm'
import PasswordReset from '../Auth/PasswordReset'

export const schema = yup.object().shape({
  name: yup.string().required('Please enter a valid name'),
  email: yup.string().email('Please enter a valid email address'),
  contact_number: yup
    .string()
    .matches(/^0\d{9}$/g, 'Numbers must begin with 0 and be 10 digits long and contain no spaces')
    .strict()
})

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
