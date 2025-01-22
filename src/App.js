import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace with your Azure Vision Service API key and endpoint
  const API_KEY = "ENTER YOUR KEY";
  const ENDPOINT = "ENTER END POINT";

  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
    setCaption("");
    setError("");
  };

  const generateCaption = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");

    const url = `${ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description`;

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await axios.post(url, formData, {
        headers: {
          "Ocp-Apim-Subscription-Key": API_KEY,
          "Content-Type": "application/octet-stream",
        },
      });

      const description = response.data.description.captions[0]?.text;
      setCaption(description || "No caption generated.");
    } catch (err) {
      setError("Failed to generate caption. Please check your API details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Azure Vision AI - Image Caption Generator</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={generateCaption} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>
      {selectedImage && (
        <div style={{ margin: "20px" }}>
          <h3>Uploaded Image:</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded Preview"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}
      {caption && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Caption:</h3>
          <p>{caption}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
