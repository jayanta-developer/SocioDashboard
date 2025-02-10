import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from "axios";

import userIcon from '../../assets/Images/userIcon.png'
import BinIcon from "../../assets/Images/bin.png"
import uploadIcon from "../../assets/Images/uploadIcon.png"

import { FetchUser, DeleteUser } from "../../store/UserSlice"
import { useDispatch, useSelector } from 'react-redux';
import { Reloader } from "../../Components/Tools";


export default function Users({ activeMenu }) {
  const dispatch = useDispatch()
  const { status, data } = useSelector((state) => state.Users);
  const [deletePop, setDeletePop] = useState(false);
  const [delUserId, setDelUserId] = useState()
  const [discountPop, setDiscountPop] = useState(false)
  const [bannerDBImg, setBannerDBImg] = useState()

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleDeletePop = (id) => {
    setDelUserId(id)
    setDeletePop(true)
  }
  const deleteUser = () => {
    dispatch(DeleteUser(delUserId))
    Reloader(600)
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "socioStays");
    // formData.append("public_id", bannerDBImg.id);
    formData.append("folder", "Banner");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/djahpqmc3/image/upload`,
        formData
      );

      setUploadedUrl(response.data.secure_url);
      await axios.post("https://socioserver-jg6j.onrender.com/socio/api/banner/update/67aa4ec8129ae99f0f58522b", {
        url: response?.data?.secure_url,
        id: response?.data?.public_id
      }).then(() => {
        alert("Image upload successfully!")
        setDiscountPop(false)
      })
        .catch((err) => console.log(err))

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    axios.get("https://socioserver-jg6j.onrender.com/socio/api/banner").then((res) => {
      setBannerDBImg(res.data[0])
    })
  }, [])

  useEffect(() => {
    dispatch(FetchUser());
    if (data?.length < 0) {
      dispatch(FetchUser());
    }
  }, []);

  return (
    <>
      {/* discount img uploader */}
      <div className={discountPop ? 'grayBox ActiveGrayBox' : "grayBox"}>
        <div className="discountPop">

          <div className="disImgBox">
            <label htmlFor="discountFileInput">
              <div className="uploadGBox">
                <img src={uploadIcon} />
              </div>
            </label>
            <img src={preview || bannerDBImg?.url} alt="Preview" width="200px" className='previewImg' />
            {/* {uploadedUrl && (<img src={uploadedUrl} alt="Uploaded" width="200px"  />)} */}
            <input id='discountFileInput' type="file" onChange={handleImageChange} />
          </div>


          <div className="popBtnBox">
            <div className="blackBtn UpdateBtn" onClick={() => setDiscountPop(false)}>
              <p>Cancel</p>
            </div>
            <div className="UpdateBtn" onClick={handleUpload}>
              <p>Upload</p>
            </div>
          </div>
        </div>

      </div>


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
        <div className="discountPopBtn UpdateBtn" onClick={() => setDiscountPop(true)}>
          <p>Upload Banner Image</p>
        </div>
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
