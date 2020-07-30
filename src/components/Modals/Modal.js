import React from 'react'

const Modal = (props) => {
  let { title, description, onClick, visible } = props
  return (
    <>
      {visible ? (
        <div className="modal-wrapper bg-tint">
          <div className="modal-card card text-black py-4 px-5  ">
            <h2 className="title">{props.title}</h2>
            <p className="description">{props.description}</p>
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
