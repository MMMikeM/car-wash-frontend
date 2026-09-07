import React from 'react'

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
            <div className="d-flex justify-content-around">
              <button className="btn btn-danger" onClick={props.hideModal}>
                Close
              </button>
              <button className="btn btn-primary" onClick={props.onClick}>
                Accept
              </button>


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
