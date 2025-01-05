import React, { useEffect, useState } from 'react';
import "./style.css"
import axios from "axios"

//images
import TrashIcon from "../../assets/Images/trash.svg"
import EditIcon from "../../assets/Images/edit.svg"
import AddIcon from "../../assets/Images/Add.png"
import removeIcon from "../../assets/Images/removeIcon.png"

//components
import { DropDown, GoTop, Reloader } from "../../Components/Tools";
import MultipleImageUpload from "../../Components/ImageUploader"

import { InfinitySpin } from 'react-loader-spinner'


import { FetchBlogs, DeleteBlog, CreateBlog } from "../../store/BlogSlice"
import { useDispatch, useSelector } from 'react-redux';

export default function Blogs({ activeMenu }) {
  const dispatch = useDispatch();
  const { status, data } = useSelector((state) => state.Blogs);
  const [delBloId, setDelBlogId] = useState()
  const [deletePop, setDeletePop] = useState(false)
  const [addBlogSection, setAddBlogSection] = useState(false)
  const [sections, setSections] = useState([
    { title: "", text: "" }
  ]);
  const [images, setImages] = useState([]);
  const [imgAltText, setImgAltText] = useState({});
  const [previewURLs, setPreviewURLs] = useState([]);
  const [createBlogVal, setCreateBlogVal] = useState({})
  const [loader, setLoader] = useState(false)


  //Creae Blogs----------

  const addSection = () => {
    setSections([...sections, { title: "", text: "" }]);
  };
  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const handleBlogInput = (e) => {
    const { name, value } = e.target;
    setCreateBlogVal(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChankInputChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const OnCreatePropertyBlog = async () => {
    setLoader(true);

    let imageUploads = [];
    if (images && images.length > 0) {
      imageUploads = images.map((image) => {
        const formData = new FormData();
        formData.append("file", image); // Pass the raw File object
        formData.append("upload_preset", "socioStays");

        // Make the POST request to Cloudinary
        return axios.post(
          "https://api.cloudinary.com/v1_1/djahpqmc3/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });
    }

    try {
      const [uploadedImages] = await Promise.all([
        Promise.all(imageUploads)
      ]);
      const imageUrls = uploadedImages.map((response) => response.data.secure_url);

      const localImagesData = imageUrls.map((el, i) => ({
        image: el,
        altText: imgAltText[i],
      }));


      dispatch(CreateBlog({
        images: localImagesData,
        conclusion: createBlogVal?.conclusion,
        meta_title: createBlogVal?.meta_title,
        meta_description: createBlogVal?.meta_description,
        SummeryArray: sections
      }))
      setLoader(false)
      // Reloader(1500)
      return {
        images: imageUrls,
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  //Delete blog
  const DeletePopOpen = (id) => {
    setDelBlogId(id)
    setDeletePop(true)
  }
  const handleDeleteBlog = () => {
    dispatch(DeleteBlog(delBloId))
    Reloader(600)

  }


  useEffect(() => {
    dispatch(FetchBlogs());
    if (data?.length < 0) {
      dispatch(FetchBlogs());
    }
  }, []);

  return (
    <>

      <div className={loader ? 'grayBox ActiveGrayBox' : "grayBox"}>
        <InfinitySpin
          visible={true}
          width="200"
          color="#fdaf17"
          ariaLabel="infinity-spin-loading"
        />
      </div>
      {/* Delete pop */}
      <div className={deletePop ? 'grayBox ActiveGrayBox' : "grayBox"}>

        <div className="popBox">
          <h3>You want to delete this Blog ?</h3>
          <div className="popBtnBox">
            <div className="blackBtn UpdateBtn" onClick={() => setDeletePop(false)}>
              <p>Cancel</p>
            </div>
            <div className="UpdateBtn" onClick={handleDeleteBlog}>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------Main section----------------------------- */}
      <div className="blogsPage PropertiesPage" style={{ display: activeMenu === 1 ? "block" : "none" }}>

        <p className="sectionHeader">Blogs Section</p>
        <div className="addPropertyBtn" onClick={() => {
          setAddBlogSection(true)
          GoTop()
        }}>
          <img src={AddIcon} />
          <p>Add Blog</p>
        </div>

        <div className="PropertyListBox">
          {/* -----------------------Add blog section------------ */}

          <div className={addBlogSection ? "addBlogBox addBlogActiveBox" : "addBlogBox"}>
            <div className="propertyRowBox" style={{ marginBottom: "30px" }}>
              <h3>Cover Images:</h3>
              <MultipleImageUpload images={images} setImages={setImages} previewURLs={previewURLs} setPreviewURLs={setPreviewURLs} imgAltText={imgAltText} setImgAltText={setImgAltText} />
            </div>


            <div className="propertyRowBox">
              <h3>Conclusion:</h3>
              <div className="PropInputBox">
                <input type="text" name='conclusion' value={createBlogVal?.conclusion} onChange={handleBlogInput}
                />
              </div>
            </div>
            <div className="propertyRowBox">
              <h3>Meta Title:</h3>
              <div className="PropInputBox">
                <input type="text" name="meta_title" onChange={handleBlogInput} value={createBlogVal?.meta_title} />
              </div>
            </div>
            <div className="propertyRowBox SummeryInputBox">
              <h3>Meta description:</h3>
              <div className="PropInputBox">
                <textarea type="text" name="meta_description" onChange={handleBlogInput} value={createBlogVal?.meta_description} />
              </div>
            </div>


            {sections?.map((section, i) => (
              <div key={i} className="blogTextSection">
                <div className="propertyRowBox">
                  <h3>Title:</h3>
                  <div className="PropInputBox">
                    <input type="text" name='title' value={section.title}
                      onChange={(e) =>
                        handleChankInputChange(i, "title", e.target.value)
                      } />
                  </div>
                </div>

                <div className="propertyRowBox SummeryInputBox">
                  <h3>Summery:</h3>
                  <div className="PropInputBox">
                    <textarea type="text" name='text' value={section.text}
                      onChange={(e) =>
                        handleChankInputChange(i, "text", e.target.value)
                      } />
                  </div>
                </div>
              </div>
            ))}
            <div className="blogChankBtnBox">
              <img src={AddIcon} className='BlogChankBtn' onClick={addSection} />
              <img src={removeIcon} className='BlogChankBtn' onClick={removeSection} />
            </div>


            <div className="BtnBox">
              <div className="UpdateBtn" onClick={() => {
                setAddBlogSection(false)
                Reloader(0)
              }}>
                <p>Cancel</p>
              </div>
              <div className="UpdateBtn" onClick={OnCreatePropertyBlog}>
                <p>Create</p>
              </div>
            </div>

          </div>





          {/* -----------------------Render all data----------------- */}
          {data?.map((el, i) => (
            <div key={i} className="propertyItemBox blogItem">
              <div className="crudIconBox">
                <img src={EditIcon} />
                <img src={TrashIcon} onClick={() => DeletePopOpen(el?._id)} />
              </div>
              {
                el?.SummeryArray?.map((e, subIndex) => (
                  <div key={subIndex} className="blogTextSection">
                    <div className="propertyRowBox">
                      <h3>Title:</h3>
                      <div className="PropInputBox">
                        <textarea type="text" name='title' value={e?.title} />
                      </div>
                    </div>

                    <div className="propertyRowBox SummeryInputBox">
                      <h3>Summery:</h3>
                      <div className="PropInputBox">
                        <textarea type="text" name='title' value={e?.text} />
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className="propertyRowBox SummeryInputBox">
                <h3>Conclusion:</h3>
                <div className="PropInputBox">
                  <textarea type="text" name='title' value={el?.conclusion} />
                </div>
              </div>
              <div className="propertyRowBox">
                <h3>Meta Title:</h3>
                <div className="PropInputBox">
                  <input type="text" name="meta_title" value={el?.meta_title} />
                </div>
              </div>
              <div className="propertyRowBox SummeryInputBox">
                <h3>Meta description:</h3>
                <div className="PropInputBox">
                  <textarea type="text" name="meta_description" value={el?.meta_description} />
                </div>
              </div>
              <div className="blogImg_Box">
                <div className="ImgMamBox">
                  {
                    el?.images?.map((imgVal, i) => (
                      <div className='RenderImgBox' key={i}>
                        <img src={imgVal?.image} />
                        <p>{imgVal?.altText}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="BtnBox">
                <button className='UpdateBtn' >Update</button>
              </div>
            </div>
          ))
          }
        </div>


      </div>
    </>
  )
}
