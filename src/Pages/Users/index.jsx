import React, { useEffect, useState } from 'react'
import "./style.css"

import userIcon from '../../assets/Images/userIcon.png'
import BinIcon from "../../assets/Images/bin.png"


import { FetchUser, DeleteUser } from "../../store/UserSlice"
import { useDispatch, useSelector } from 'react-redux';
import { Reloader } from "../../Components/Tools";


export default function Users({ activeMenu }) {
  const dispatch = useDispatch()
  const { status, data } = useSelector((state) => state.Users);
  const [deletePop, setDeletePop] = useState(false);
  const [delUserId, setDelUserId] = useState()

  const handleDeletePop = (id) => {
    setDelUserId(id)
    setDeletePop(true)
  }
  const deleteUser = () => {
    dispatch(DeleteUser(delUserId))
    Reloader(600)
  }

  useEffect(() => {
    dispatch(FetchUser());
    if (data?.length < 0) {
      dispatch(FetchUser());
    }
  }, []);

  return (
    <>
      <div className={deletePop ? 'grayBox ActiveGrayBox' : "grayBox"}>

        <div className="popBox">
          <h3>You want to delete this Property ?</h3>
          <div className="popBtnBox">
            <div className="blackBtn UpdateBtn" onClick={() => setDeletePop(false)}>
              <p>Cancel</p>
            </div>
            <div className="UpdateBtn" onClick={deleteUser}>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>


      <div className="userPage PropertiesPage" style={{ display: activeMenu === 2 ? "block" : "none" }}>
        <div className="userListBox">
          <div className="userTableHeader">
            <div className="tablecel"><p>Name</p></div>
            <div className="tablecel"><p>Email</p></div>
            <div className="tablecel"><p>Phone</p></div>
          </div>
          {
            data?.map((el, i) => (
              <div className="userTableRow">
                <div className="tablecel"><p>{el?.name}</p></div>
                <div className="tablecel"><p>{el?.email}</p></div>
                <div className="tablecel"><p>{el?.phone}</p></div>

                <img src={userIcon} className='tableUserIcon' alt="" />
                <img src={BinIcon} className='tableBinIcon' onClick={() => handleDeletePop(el?._id)} />
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}
