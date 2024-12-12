import React, { useState, useEffect } from 'react';
import "./style.css"

//images
import TrashIcon from "../../assets/Images/trash.svg"
import EditIcon from "../../assets/Images/edit.svg"
import AddIcon from "../../assets/Images/Add.png"
import crossIcon from "../../assets/Images/icons8-cross.svg"
import dropIocn from "../../assets/Images/ArrowGray.png";

import { FetchProperties, CreateProperty, DeletePropert } from "../../store/PropertySlice";
import { useDispatch, useSelector } from 'react-redux';

//components
import { DropDown, Reloader } from "../../Components/Tools";

//data
import { facilites } from "../../assets/index"

export default function Properties({ activeMenu }) {
  const dispatch = useDispatch();
  // dispatch(FetchProperties());
  const { status, data } = useSelector((state) => state.Properties);

  const [facilitiesDrop, setFacilitiesDrop] = useState()
  const [facilitiesDropVal, setFacilitiesDropVal] = useState("text text")

  const [dropdownStates, setDropdownStates] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  const [localPropertyData, setLocalPropertyData] = useState();
  const [localPropMapVal, setLocalPropMapVal] = useState();
  const [createPropertyBox, setCreatePropertyBox] = useState(false);
  const [facilitiesCrDrop, setFacilitiesCrDrop] = useState();
  const [facilitiesCrDropVal, setFacilitiesCrDropVal] = useState("");
  const [facilitiesCrData, setFacilitiesCrData] = useState([]);




  const handleLocalPropertyVal = (e) => {
    const { name, value } = e.target;
    setLocalPropertyData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleLocalPropertMapVal = (e) => {
    const { name, value } = e.target;
    setLocalPropMapVal(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // Toggle dropdown visibility
  const toggleDropdown = (cardId) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [cardId]: !prevStates[cardId],
    }));
  };

  // Handle dropdown value change
  const handleValueChange = (cardId, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [cardId]: value,
    }));
    // Optionally close the dropdown after selecting
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [cardId]: false,
    }));
  };



  const handleLocalFacltyDropClick = (val) => {
    const ary = [...facilitiesCrData];
    if (!ary.includes(val)) {
      ary.push(val)
      setFacilitiesCrData(ary)
    } else {
      return
    }
  }
  const handleLocalFacChipDel = (i) => {
    const ary = [...facilitiesCrData]
    const newArray = ary.filter((_, index) => index !== i);
    setFacilitiesCrData(newArray);
  }


  //create property
  const OnCreateProperty = () => {
    dispatch(CreateProperty({
      title: localPropertyData?.title,
      summery: localPropertyData.summery,
      images: ["url1", "url2"],
      video: "video url",
      city: localPropertyData?.city,
      sector: localPropertyData?.sector,
      map: [localPropMapVal?.lat, localPropMapVal?.long],
      price: localPropertyData.price,
      owner: localPropertyData.owner,
      room: localPropertyData.room,
      bath: localPropertyData.bath,
      area: localPropertyData.area,
      facilities: facilitiesCrData
    }))
    Reloader(500)
  }

  //delete property
  const DeleteProperty = (id) => {
    dispatch(DeletePropert(id))
    Reloader(500)
  }


  useEffect(() => {
    dispatch(FetchProperties());
    if (data?.length < 0) {
      dispatch(FetchProperties());
    }

  }, [])
  return (
    <>
      <div className="PropertiesPage" style={{ display: activeMenu === 0 ? "block" : "none" }}>
        <p className="sectionHeader">Property Section</p>
        <div className="addPropertyBtn" onClick={() => setCreatePropertyBox(true)}>
          <img src={AddIcon} />
          <p>Add Property</p>
        </div>


        <div className="PropertyListBox">
          {/* -----------------------Add property section------------ */}
          <div className={createPropertyBox ? "propertyItemBox createPropertyBox createPropertyBoxActive" : "propertyItemBox createPropertyBox"}>
            <div className="propertyRowBox">
              <h3>Title:</h3>
              <div className="PropInputBox">
                <input type="text" placeholder='Title' name='title' onChange={handleLocalPropertyVal} />
              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Price:</h3>
              <div className="PropInputBox">
                <input type="text" name="price" onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox SummeryInputBox">
              <h3>Summery:</h3>
              <div className="PropInputBox">
                <textarea type="text" name='summery' onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Owner:</h3>
              <div className="PropInputBox">
                <input type="text" name='owner' onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox">
              <h3>City:</h3>
              <div className="PropInputBox">
                <input type="text" name='city' onChange={handleLocalPropertyVal} />
              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Map:</h3>
              <div className="PropInputBox towInput">
                <input type="text" placeholder='latitude' name='lat' onChange={handleLocalPropertMapVal} />|
                <input type="text" placeholder='longitude' name='long' onChange={handleLocalPropertMapVal} />
              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Sector:</h3>
              <div className="PropInputBox">
                <input type="text" name='sector' onChange={handleLocalPropertyVal} />
              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Area:</h3>
              <div className="PropInputBox">
                <input type="text" name='area' onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Room:</h3>
              <div className="PropInputBox">
                <input type="text" name='room' onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Bath:</h3>
              <div className="PropInputBox">
                <input type="text" name='bath' onChange={handleLocalPropertyVal} />

              </div>
            </div>
            <div className="propertyRowBox facltyInBox">
              <h3>Facilities:</h3>
              <div className="facilitiInputBox">

                <div className="dropDwon" onClick={() => setFacilitiesCrDrop(!facilitiesCrDrop)}>
                  <p className="dropText">{facilitiesCrDropVal || "Select facilities"}</p>
                  <img src={dropIocn} className="dropIcon" />
                  <div className={facilitiesCrDrop ? "dropListBox dropListBoxActive" : "dropListBox"}>
                    {facilites?.map((el, i) => (
                      <div key={i} className="dropItem" onClick={() => {
                        setFacilitiesCrDropVal(el)
                        handleLocalFacltyDropClick(el)
                      }}>
                        <p>{el}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chipBox">
                  {
                    facilitiesCrData?.map((e, i) => (
                      <div key={i} className="chip">
                        <p>{e}</p>
                        <img src={crossIcon} className="crossIcon" onClick={() => handleLocalFacChipDel(i)} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="BtnBox">

              <div className="UpdateBtn" onClick={() => {
                setCreatePropertyBox(false)
                Reloader(0)
              }}>
                <p>Cancel</p>
              </div>
              <div className="UpdateBtn" onClick={OnCreateProperty}>
                <p>Create</p>
              </div>

            </div>
          </div>


          {
            data?.map((el, i) => (
              <div key={i} className="propertyItemBox">
                <div className="crudIconBox">
                  <img src={EditIcon} alt="" />
                  <img src={TrashIcon} alt="" onClick={() => DeleteProperty(el?._id)} />
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
                    <input type="text" value={el?.price} />
                  </div>
                </div>
                <div className="propertyRowBox SummeryInputBox">
                  <h3>Summery:</h3>
                  <div className="PropInputBox">
                    <textarea type="text" value={el?.summery} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Owner:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.owner} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>City:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.city} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Map:</h3>
                  <div className="PropInputBox towInput">
                    <input type="text" value={el?.map[0]} />,
                    <input type="text" value={el?.map[0]} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Sector:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.sector} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Area:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.area} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Room:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.room} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Bath:</h3>
                  <div className="PropInputBox">
                    <input type="text" value={el?.bath} />
                  </div>
                </div>
                <div className="propertyRowBox facltyInBox">
                  <h3>facilities:</h3>
                  <div className="facilitiInputBox">
                    <div className="chipBox">
                      {
                        el?.facilities?.map((el, i) => (
                          <div key={i} className="chip">
                            <p>{el}</p>
                            <img src={crossIcon} className="crossIcon" />
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className="BtnBox">

                  <div className="UpdateBtn">
                    <p>Save</p>
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
