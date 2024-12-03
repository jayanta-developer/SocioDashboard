import React, { useState, useEffect } from 'react';
import "./style.css"

//images
import TrashIcon from "../../assets/Images/trash.svg"
import EditIcon from "../../assets/Images/edit.svg"
import AddIcon from "../../assets/Images/Add.png"

import { FetchProperties } from "../../store/PropertySlice";
import { useDispatch, useSelector } from 'react-redux';

export default function Properties() {
  const dispatch = useDispatch();
  const { status, data } = useSelector((state) => state.Properties);


  console.log(data);
  console.log(status);

  useEffect(() => {
    if (data?.length < 0) {
      dispatch(FetchProperties());
    }

  }, [data])
  return (
    <>
      <div className="PropertiesPage">
        <p className="sectionHeader">Property Section</p>
        <div className="addPropertyBtn">
          <img src={AddIcon} />
          <p>Add Property</p>
        </div>

        <div className="PropertyListBox">
          {
            data?.map((el, i) => (
              <div key={i} className="propertyItemBox">
                <div className="crudIconBox">
                  <img src={EditIcon} alt="" />
                  <img src={TrashIcon} alt="" />
                </div>

                <div className="propertyRowBox">
                  <h3>Title:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.title} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Price:</h3>
                  <div className="PropInputBox">
                    <input type="text" />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Summery:</h3>
                  <div className="PropInputBox">
                    <input type="text" />
                  </div>
                </div>
              </div>
            ))
          }



        </div>

      </div>
    </>
  )
}
