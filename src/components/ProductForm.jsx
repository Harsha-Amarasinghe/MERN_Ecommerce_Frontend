import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductForm.css";
import Breadcrumb from "./Breadcrumb";

const ProductForm = () => {
  const { id } = useParams(); // Get product ID for editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    quantity: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!response.ok) throw new Error("Failed to fetch product");
          const data = await response.json();
          setFormData({
            sku: data.sku,
            name: data.name,
            quantity: data.quantity,
            description: data.description,
            images: data.images || [],
          });
        } catch (error) {
          console.error("Error fetching product:", error.message);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData[key].forEach((file) => formDataToSend.append("images", file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/products/${id}`
      : "http://localhost:5000/api/products";

    try {
      const response = await fetch(url, { method, body: formDataToSend });
      if (!response.ok) throw new Error("Failed to submit form");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="product-form-container">
      <Breadcrumb />
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleInputChange}
            required
            disabled={!!id} // Disable SKU input for editing
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="A small description about the product"
            required
          ></textarea>
        </div>
        <div className="form-group full-width">
          <label htmlFor="images">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
          <small>JPEG, PNG, SVG or GIF (Maximum file size 50MB)</small>
          <div className="image-preview">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt={`Preview ${index}`}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="form-button">
          {id ? "Save Changes" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
