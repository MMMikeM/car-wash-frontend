import React from 'react'

const Modal = (props) => {
  console.log(props)
  // console.log(props.registration)
  let name = ''
  let contactNumber = ''
  let message = () => {
    if (props.profile.length === 1) {
      name = props.profile[0].name
      contactNumber = props.profile[0].contact_number
      return `User found! Would you like to add a wash to ${name}'s profile`
    }
    if (props.registration === '' && props.contactNumber === '') {
      return 'User not found, create new user?'
    } else if (props.registration && !props.contactNumber) {
      return 'Registration found, would you like to add a wash to this profile?'
    }
  }
  // console.log(message())
  return (
    <>
      {props.visible ? (
        <div className="modal-wrapper bg-tint">
          <div className="modal-card card title text-white py-4 px-5  bg-3">
            <h2 className="">{name}</h2>
            <h2 className="">{contactNumber}</h2>
            <p className="description">{message()}</p>
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
