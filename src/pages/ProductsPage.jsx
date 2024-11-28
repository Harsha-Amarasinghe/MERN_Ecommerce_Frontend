import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Button,
    Box,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import DeletePopup from "../components/DeletePopup";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css"; 
import Breadcrumb from "../components/Breadcrumb";
import './ProductsPage.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (searchText) => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setShowDeletePopup(true);
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setProductToDelete(null);
    };

    const handleEditClick = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleAddNewProductClick = () => {
        navigate("/add-product");
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${productToDelete}`,
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Failed to delete product");

            setFilteredProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== productToDelete)
            );
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== productToDelete)
            );

            setShowDeletePopup(false);
            setProductToDelete(null);
        } catch (err) {
            console.error("Error deleting product:", err.message);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/favorite`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to toggle favorite status");

            const updatedProduct = await response.json();

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id ? updatedProduct : product
                )
            );
            setFilteredProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id ? updatedProduct : product
                )
            );
        } catch (err) {
            console.error("Failed to update favorite:", err.message);
        }
    };

    const handleToggleFavorites = () => {
        setShowFavorites((prev) => !prev);
        if (!showFavorites) {
            setFilteredProducts(products.filter((product) => product.isFavorite));
        } else {
            setFilteredProducts(products);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box className="container">
            <Breadcrumb />
            <Box className="action-buttons">
                <SearchBar className="search-bar" onSearch={handleSearch} />
                <Box>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "#0025a0",
                            color: "#fff", 
                        }}
                        onClick={handleAddNewProductClick}
                        sx={{ marginRight: "8px" }}
                    >
                        Add New Product
                    </Button>
                    <IconButton
                        onClick={handleToggleFavorites}
                        className={`favorite-icon ${showFavorites ? "active" : "inactive"
                            }`}
                    >
                        <img
                            src={
                                showFavorites
                                    ? "/assets/starred.svg"
                                    : "/assets/star.svg"
                            }
                            alt="Favorite"
                            className="icon"
                        />
                    </IconButton>
                </Box>
            </Box>

            <Table className="table-container">
                <TableHead>
                    <TableRow>
                        <TableCell className="table-header">SKU</TableCell>
                        <TableCell className="table-header">Image</TableCell>
                        <TableCell className="table-header">Name</TableCell>
                        <TableCell className="table-header">Quantity</TableCell>
                        <TableCell className="table-header"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>
                                {product.images?.length > 0 && (
                                    <img
                                        src={`http://localhost:5000/${product.images[0]}`}
                                        alt={product.name}
                                    />
                                )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell className="action-icons">
                                <IconButton
                                    className="action-icon"
                                    onClick={() => handleEditClick(product._id)}
                                >
                                    <img
                                        src="/assets/edit-icon.svg"
                                        alt="Edit"
                                        className="icon"
                                    />
                                </IconButton>
                                <IconButton
                                    className="action-icon"
                                    onClick={() => handleDeleteClick(product._id)}
                                >
                                    <img
                                        src="/assets/delete-icon.svg"
                                        alt="Delete"
                                        className="icon"
                                    />
                                </IconButton>
                                <IconButton
                                    className={`action-icon favorite-icon ${product.isFavorite ? "active" : "inactive"
                                        }`}
                                    onClick={() => toggleFavorite(product._id)}
                                >
                                    <img
                                        src={
                                            product.isFavorite
                                                ? "/assets/starred.svg"
                                                : "/assets/star.svg"
                                        }
                                        alt="Favorite"
                                        className="icon"
                                    />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {showDeletePopup && (
                <DeletePopup
                    onCancel={handleCancelDelete}
                    onDelete={handleConfirmDelete}
                />
            )}
        </Box>
    );
};

export default ProductsPage;
