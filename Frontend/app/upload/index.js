import { useState, useEffect } from "react";

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch all uploaded images from the backend
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/uploads");
      const data = await response.json();
      setUploadedImages(data);
    } catch (error) {
      console.error("❌ Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images on component mount
  }, []);

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
        fetchImages(); // Refresh images list
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

      <h2>Uploaded Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {uploadedImages.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:5000/uploads/${img.filename}`} 
            alt={`Uploaded ${index}`}
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadScreen;
