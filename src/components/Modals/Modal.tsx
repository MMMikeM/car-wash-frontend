import React from 'react'
import { transformCentsToRands } from '../../helpers'
import { Button } from '@/components/ui/button'

const Modal = (props) => {
  return (
    <>
      {props.visible ? (
        <div className="modal-wrapper bg-tint">
          <div className="modal-card card text-black py-4 px-5  ">
            <h2 className="title">{props.wash.name}</h2>
            <p className="description">
              Are you sure you want to add the following wash?
            </p>
            <p className="mb-2">
              Username: <strong>{props.user.name}</strong>
            </p>
            <p className="mb-2">
              Wash Price:{' '}
              <strong>{transformCentsToRands(props.wash.price)}</strong>
            </p>
            <p className="mb-4">
              Wash Type: <strong>{props.wash.name}</strong>
            </p>
            <div className="flex justify-around">
              <Button variant="destructive" onClick={props.hideModal}>
                Close
              </Button>
              <Button onClick={props.onClick}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default Modal
