import React, { useState } from "react";
import axios from "axios";
import "./style.css"; // Import the CSS

import videoImg from "../../assets/Images/uploadIcon.png";

const VideoUpload = ({ video, setVideo }) => {
  const [videoPreviewURL, setVideoPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideo(file);
    setVideoPreviewURL(URL.createObjectURL(file));
  };

  const handleDelete = () => {
    setVideo(null);
    setVideoPreviewURL(null);
  };

  const handleVideoUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("video", video);

    try {
      setLoading(true);
      const response = await axios.post("/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Video uploaded successfully:", response.data);
      setVideo(null);
      setVideoPreviewURL(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-upload-container">

      <label htmlFor="VideofileInput">
        <img src={videoImg} />
      </label>

      <input id="VideofileInput" type="file" accept="video/*" onChange={handleFileChange} />

      {videoPreviewURL && (
        <div className="video-preview-container">
          <video className="video-preview" src={videoPreviewURL} controls />
          <button onClick={handleDelete} className="delete-btn">
            ✖
          </button>
        </div>
      )}
      {/* <button
        onClick={handleUpload}
        disabled={!video || loading}
        className="upload-btn"
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button> */}
    </div>
  );
};

export default VideoUpload;
