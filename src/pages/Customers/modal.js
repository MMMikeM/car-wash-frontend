import React from 'react'

const Modal = (props) => {
  console.log(props)
  let dateTime = props.user.washes
    .filter((wash) => wash.id === props.id)[0]
    ?.created_at

  return (
    <>
      {props.visible ? (
        <div className="modal-wrapper bg-tint">
          <div className="modal-card card title text-white py-4 px-5  bg-3">
            <h4 className="">
              <span className="mr-2 text-7">Name:</span> {props.user.name}
            </h4>
            <h4 className="">
              <span className="mr-2 text-7">Wash:</span>
              {
                props.user.washes.filter((wash) => wash.id === props.id)[0]
                  .wash
              }
            </h4>
            <h4 className="">
              <span className="mr-2 text-7">Date:</span> {dateTime.substr(0, 9)}
            </h4>
            <h4 className="">
              <span className="mr-2 text-7">Time:</span>{' '}
              {dateTime.substr(11)}
            </h4>
            <p className="description">
              Are you sure you would like to delete this wash?
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
