import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = () => {
  const { id } = useParams(); // Check if editing a product
  const location = useLocation();

  let breadcrumbText;
  if (location.pathname === "/") {
    breadcrumbText = "Products";
  } else if (id) {
    breadcrumbText = "Edit Product";
  } else {
    breadcrumbText = "Add New Product";
  }

  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb-link">Products</Link>
      {breadcrumbText !== "Products" && (
        <>
          <span className="breadcrumb-separator"><img
                                        src="/assets/arrow.svg"
                                        alt="Arrow"
                                        className="icon"
                                    /></span>
          <span className="breadcrumb-current">{breadcrumbText}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
