import React, { useState } from "react";
import "./style.css";

import AddIcon from "../../assets/Images/addImg.png";


const MultipleImageUpload = ({ images, setImages, previewURLs, setPreviewURLs, imgAltText, setImgAltText }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...fileArray]);
  };

  const handleDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewURLs.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewURLs(updatedPreviews);
  };

  const handleLocalAltVal = (e) => {
    const { name, value } = e.target;
    setImgAltText(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  return (
    <div className="upload-container">
      <input
        id="fileInput"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="preview-container">
        {previewURLs.map((url, index) => (
          <div key={index} className="preview-item">
            <img src={url} alt="thumbnail" />
            <button onClick={() => handleDelete(index)} className="delete-btn">
              ✖
            </button>
            <textarea name={index} className="imgAltTextInput" placeholder="ALT Text" onChange={handleLocalAltVal} value={imgAltText?.index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleImageUpload;
