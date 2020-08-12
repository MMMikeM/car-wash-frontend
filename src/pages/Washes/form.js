import React from 'react'
import * as yup from 'yup';
import BasicForm from '../../components/Forms/BasicForm'
import { centsToRands } from '../../helpers'


export const schema = yup.object().shape({
    name: yup.string().required('Please enter a valid name'),
    cost: yup.number(),
    price: yup.number().required(),
    points: yup.number(),
    description: yup.string()
     });


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




