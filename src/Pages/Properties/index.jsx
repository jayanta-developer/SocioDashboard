import React, { useState, useEffect } from 'react';
import "./style.css"
import axios from "axios"

//images
import TrashIcon from "../../assets/Images/trash.svg"
import EditIcon from "../../assets/Images/edit.svg"
import AddIcon from "../../assets/Images/Add.png"
import crossIcon from "../../assets/Images/icons8-cross.svg"
import dropIocn from "../../assets/Images/ArrowGray.png";

import { FetchProperties, CreateProperty, DeletePropert, UpdateProperty } from "../../store/PropertySlice";
import { useDispatch, useSelector } from 'react-redux';

//components
import { DropDown, Reloader } from "../../Components/Tools";
import MultipleImageUpload from "../../Components/ImageUploader"
import VideoUpload from "../../Components/VideoUploader"

//data
import { facilites } from "../../assets/index"

export default function Properties({ activeMenu }) {
  const dispatch = useDispatch();
  // dispatch(FetchProperties());
  const { status, data } = useSelector((state) => state.Properties);
  const [dropdownStates, setDropdownStates] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [localPropertyData, setLocalPropertyData] = useState();
  const [createPropertyBox, setCreatePropertyBox] = useState(false);
  const [facilitiesCrData, setFacilitiesCrData] = useState([]);

  //update
  const [updateProperty, setUpdateProperty] = useState({})
  const [updateEditIndex, setUpdateEditIndex] = useState()
  const [facilitiesUpdate, setFacilitiesUpdate] = useState({})

  const [updatedFChipAry, setUpdatedFChipAry] = useState([]);
  const [updatedFChipIndex, setUpdatedFChipIndex] = useState();
  const [updatedFChipId, setUpdatedFChipId] = useState();

  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);


  const handleLocalPropertyVal = (e) => {
    const { name, value } = e.target;
    setLocalPropertyData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

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


  //update Facilities
  const handDBFacltyDropClick = (elValues, val, i) => {
    const ary = [...elValues?.facilities];
    if (!ary.includes(val)) {
      ary.push(val)
    } else {
      return
    }
    setFacilitiesUpdate(
      {
        facilities: ary
      }
    )
  }

  const HandleDelFacilities = (el, ClickVal, i) => {
    const removeItem = (array, item) => array.filter((i) => i !== item);
    const ary = [...el?.facilities];

    setUpdatedFChipAry(removeItem(ary, ClickVal))
    setUpdatedFChipIndex(i)
    setUpdatedFChipId(el?._id)
  }


  //create property
  const requiredFields = ['title', 'summery', 'city', 'sector', 'mapLat', 'mapLong', 'price', 'owner', 'room', 'bath', 'area'];
  const isAnyFieldMissing = requiredFields.some(field => !localPropertyData?.[field]);
  const OnCreateProperty = async () => {

    if (isAnyFieldMissing) {
      alert("Please fill all the fields!");
      return;
    }



    let imageUploads = []; // Ensure it's always an array
    if (images && images.length > 0) {
      imageUploads = images.map((image) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'NewPreset');
        return axios.post('https://api.cloudinary.com/v1_1/dtmhts73e/image/upload', formData);
      });
    }

    // Upload video to Cloudinary
    let videoUpload = [];
    if (video) {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('upload_preset', 'NewPreset');
      videoUpload = axios.post('https://api.cloudinary.com/v1_1/dtmhts73e/video/upload', formData);
    }

    // Wait for all uploads to complete
    const [uploadedImages, uploadedVideo] = await Promise.all([
      Promise.all(imageUploads),
      videoUpload,
    ]);

    try {
      // Wait for all uploads to complete
      const [uploadedImages, uploadedVideo] = await Promise.all([
        Promise.all(imageUploads), // Handles image uploads (empty array is fine)
        videoUpload,              // Handles video upload (can be null)
      ]);

      // Extract URLs
      const imageUrls = uploadedImages.map((response) => response.data.secure_url); // Get image URLs
      const videoUrl = uploadedVideo?.data?.secure_url || ''; // Get video URL or fallback to an empty string

      // Log the URLs
      // console.log('Image URLs:', imageUrls);
      // console.log('Video URL:', videoUrl);


      dispatch(CreateProperty({
        title: localPropertyData?.title,
        summery: localPropertyData.summery,
        images: imageUrls,
        video: videoUrl,
        city: localPropertyData?.city,
        sector: localPropertyData?.sector,
        mapLat: localPropertyData?.mapLat,
        mapLong: localPropertyData?.mapLong,
        price: localPropertyData.price,
        owner: localPropertyData.owner,
        room: localPropertyData.room,
        bath: localPropertyData.bath,
        area: localPropertyData.area,
        facilities: facilitiesCrData
      }))
      Reloader(1500)

      // Example: Return or dispatch the collected URLs
      return {
        images: imageUrls,
        video: videoUrl,
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  //delete property
  const DeleteProperty = (id) => {
    dispatch(DeletePropert(id))
    Reloader(600)
  }


  //update local property
  const handelUpdateProperty = (event, index) => {
    const { name, value } = event.target;
    setUpdateProperty((prevData) => ({
      ...prevData,
      [index]: { ...prevData[index], [name]: value }
    }));
  }
  //update DB property
  const handleDBPropertyUpdate = (i, id) => {
    dispatch(UpdateProperty({ data: updateProperty[i], id, otherVal: facilitiesUpdate }))
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
                <input type="text" placeholder='latitude' name='mapLat' onChange={handleLocalPropertyVal} />|
                <input type="text" placeholder='longitude' name='mapLong' onChange={handleLocalPropertyVal} />
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
                <select className='dropDwon'
                  onChange={(e) => {
                    handleLocalFacltyDropClick(e.target.value)
                  }}>
                  <option value="">Select Facilities</option>
                  {facilites?.map((el, i) => (
                    <option key={i} className="dropItem" >
                      <p>{el}</p>
                    </option>
                  ))}
                </select>

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

            <div className="propertyRowBox">
              <h3>Cover Images:</h3>
              <MultipleImageUpload images={images} setImages={setImages} />
            </div>
            <div className="propertyRowBox">
              <h3>Video:</h3>
              <VideoUpload video={video} setVideo={setVideo} />
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

          {/* -----------------------Render all data----------------- */}
          {
            data?.map((el, i) => (
              <div key={i} className="propertyItemBox">
                <div className="crudIconBox">
                  <img src={EditIcon} alt="" onClick={() => {
                    setUpdateEditIndex(i)
                    setFacilitiesUpdate({})
                  }} />
                  <img src={TrashIcon} alt="" onClick={() => DeleteProperty(el?._id)} />
                </div>

                <div className="propertyRowBox">
                  <h3>Title:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='title' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.title : el?.title} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Price:</h3>
                  <div className="PropInputBox">
                    <input type="text" name="price" disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.price : el?.price} />
                  </div>
                </div>
                <div className="propertyRowBox SummeryInputBox">
                  <h3>Summery:</h3>
                  <div className="PropInputBox">
                    <textarea type="text" name="summery" disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.summery : el?.summery} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Owner:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='owner' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.owner : el?.owner} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>City:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='city' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.city : el?.city} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Map:</h3>
                  <div className="PropInputBox towInput">
                    <input type="text" name='mapLat' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.mapLat : el?.mapLat} />,
                    <input type="text" name='mapLong' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.mapLat : el?.mapLat} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Sector:</h3>
                  <div className="PropInputBox">
                    <input type="text" name="sector" disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.sector : el?.sector} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Area:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='area' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.area : el?.area} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Room:</h3>
                  <div className="PropInputBox">
                    <input type="text" name="room" disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.room : el?.room} />
                  </div>
                </div>
                <div className="propertyRowBox">
                  <h3>Bath:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='bath' disabled={updateEditIndex !== i} onChange={(e) => handelUpdateProperty(e, i)} value={updateProperty[i] ? updateProperty[i]?.bath : el?.bath} />
                  </div>
                </div>
                <div className="propertyRowBox facltyInBox">
                  <h3>facilities:</h3>
                  <div className="facilitiInputBox">

                    <select disabled={updateEditIndex !== i} className='dropDwon renderFDrop'
                      onChange={(e) => {
                        handDBFacltyDropClick(el, e.target.value, i)
                      }}>
                      <option value="">Select Facilities</option>
                      {facilites?.map((el, i) => (
                        <option key={i} className="dropItem" >
                          <p>{el}</p>
                        </option>
                      ))}
                    </select>

                    <div className="chipBox">
                      {
                        (updatedFChipIndex === undefined || updatedFChipIndex !== i) ? (
                          el?.facilities?.map((eVal, index) => (
                            <div key={index} className="chip">
                              <p>{eVal}</p>
                              <img
                                src={crossIcon}
                                className="crossIcon"
                                onClick={() => HandleDelFacilities(el, eVal, i)}
                              />
                            </div>
                          ))
                        ) :
                          (
                            updatedFChipAry?.map((eVal, index) => (
                              <div key={index} className="chip">
                                <p>{eVal}</p>
                                <img
                                  src={crossIcon}
                                  className="crossIcon"
                                  onClick={() => HandleDelFacilities(el, eVal, i)}
                                />
                              </div>
                            ))
                          )
                      }
                    </div>
                  </div>
                </div>
                <div className="BtnBox">
                  <button className={updateEditIndex !== i ? 'UpdateBtn ' : "UpdateBtn BtnActive"} disabled={updateEditIndex !== i} onClick={() => handleDBPropertyUpdate(i, el?._id)}>Update</button>
                </div>
              </div>
            ))
          }



        </div>

      </div>
    </>
  )
}
