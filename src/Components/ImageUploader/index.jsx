import React, { useState } from "react";
import axios from "axios";
import "./style.css"; // Import the CSS

import AddIcon from "../../assets/Images/addImg.png";


const MultipleImageUpload = ({ images, setImages }) => {
  const [previewURLs, setPreviewURLs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleImagesUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);
      const response = await axios.post("/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Images uploaded successfully:", response.data);
      setImages([]);
      setPreviewURLs([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">

      <label htmlFor="fileInput">
        <img src={AddIcon} className="uploadImgIcon" alt="Upload Icon" />
      </label>

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
          </div>
        ))}
      </div>
      {/* <button onClick={handleUpload} disabled={loading} className="upload-btn">
        {loading ? "Uploading..." : "Upload Images"}
      </button> */}
    </div>
  );
};

export default MultipleImageUpload;
