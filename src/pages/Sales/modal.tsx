import React from 'react'
import { Button } from '@/components/ui/button'

const Modal = (props) => {

  console.log(props)
  return (
    <>
      {props.visible ? (
        <div className="modal-wrapper bg-tint">
          <div className="modal-card card title text-white py-4 px-5  bg-3">

            <h4 className="">
              <span className="mr-2 text-7">Name:</span> {props.selectedCustomer.name}
            </h4>
            <p className="description">
              Are you sure you would like to delete this customer?
            </p>
            <div className="flex justify-content-around">
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
