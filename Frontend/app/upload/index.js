import { useState } from "react";

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.filePath) {
        console.log("✅ Image uploaded:", data.filePath);
        setUploadStatus("✅ Image uploaded successfully!");
      } else {
        console.error("❌ Upload failed:", data);
        setUploadStatus("❌ Upload failed.");
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setUploadStatus("❌ Error uploading image.");
    }
  };

  const handleUpload = () => {
    if (!image) {
      setUploadStatus("⚠️ Please select an image first.");
      return;
    }
    uploadImage(image);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload an Image</h2>
      
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {preview && (
        <div style={{ marginTop: "10px" }}>
          <img src={preview} alt="Preview" style={{ width: "200px", borderRadius: "10px" }} />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Upload Image
      </button>

      {uploadStatus && <p style={{ marginTop: "10px", color: "#ff0000" }}>{uploadStatus}</p>}
    </div>
  );
};

export default UploadScreen;
