"use client";
import React, { useState, useEffect } from "react";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Pagination,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const ProductManagement = () => {
  const [formData, setFormData] = useState({
    id: "",
    category_id: "",
    name: "",
    description: "",
    image: null,
    price_per_unit: "",
  });
  const [loading, setLoading] = useState(false); // Global loading spinner
  const [buttonLoading, setButtonLoading] = useState(false); // Save button spinner
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // For categories
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // success or error
  const [modelOpen, setModelOpen] = useState(false);
  const [filter, setFilter] = useState(""); // Search filter
  const [page, setPage] = useState(1); // Pagination
  const itemsPerPage = 5; // Number of items per page
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [deleteProductId, setDeleteProductId] = useState(null); // ID for deletion

  // Fetch products from the server
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://app.swabilaundry.ae/api/get_products.php");
      if (response.data.status === "success") {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // Initially set to all products
      } else {
        throw new Error(response.data.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setSnackbarType("error");
      setSnackbarMessage("Failed to fetch products.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for the Select dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://app.swabilaundry.ae/api/get_categories.php");
      if (response.data.status === "success") {
        setCategories(response.data.data); // Populate the categories state
      } else {
        throw new Error(response.data.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSnackbarType("error");
      setSnackbarMessage("Failed to fetch categories.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products based on search input
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.description.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(1); // Reset to the first page after filtering
  }, [filter, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category_id: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.name || !formData.description || !formData.price_per_unit) {
      setSnackbarType("error");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    const data = new FormData();
    data.append("category_id", formData.category_id);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price_per_unit", formData.price_per_unit);

    if (formData.image) {
      data.append("image", formData.image);
    }

    setButtonLoading(true);
    try {
      let response;
      if (formData.id) {
        // Edit product
        data.append("product_id", formData.id);
        response = await axios.post("https://app.swabilaundry.ae/api/edit_product.php", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new product
        response = await axios.post("https://app.swabilaundry.ae/api/add_product.php", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.status === "success") {
        setSnackbarType("success");
        setSnackbarMessage(formData.id ? "Product updated successfully." : "Product added successfully.");
        setSnackbarOpen(true);
        fetchProducts(); // Refresh product list
        handleClose(); // Close modal and reset form
      } else {
        throw new Error(response.data.message || "Failed to save product.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarType("error");
      setSnackbarMessage("Failed to save product.");
      setSnackbarOpen(true);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.product_id,
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      price_per_unit: product.price_per_unit,
      image: product.imgurl || null, // Use existing image URL
    });
    setModelOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteProductId(id);
    setDeleteDialogOpen(true); // Open delete confirmation dialog
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://app.swabilaundry.ae/api/delete_product.php",
        { product_id: deleteProductId },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        setSnackbarType("success");
        setSnackbarMessage("Product deleted successfully.");
        setSnackbarOpen(true);
        setProducts((prev) => prev.filter((prod) => prod.product_id !== deleteProductId)); // Update the list
        setDeleteDialogOpen(false); // Close dialog
      } else {
        throw new Error(response.data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackbarType("error");
      setSnackbarMessage("Failed to delete product.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModelOpen(false);
    setFormData({ id: "", category_id: "", name: "", description: "", image: null, price_per_unit: "" }); // Reset form
  };

  const handlePageChange = (event, value) => setPage(value);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: "#F9FAFC", minHeight: "100vh" }}>
      {/* Loading Spinner */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Search Bar */}
        <TextField
          label="Search Products"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: "300px", backgroundColor: "#fff" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={() => setModelOpen(true)}
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            ":hover": { backgroundColor: "#0056b3" },
          }}
        >
          Add New Product
        </Button>
      </Stack>

      {/* Product Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#007BFF" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Category ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Price Per Unit</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>
                  {product.imgurl && (
                    <img
                      src={`https://app.swabilaundry.ae/api/${product.imgurl}`}
                      alt="Product"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </TableCell>
                <TableCell>{product.category_id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price_per_unit}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)} sx={{ color: "#007BFF" }}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(product.product_id)} sx={{ color: "#FF4C4C" }}>
                    <FaTrashAlt />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredProducts.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={modelOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{formData.id ? "Edit Product" : "Add New Product"}</Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                required
              />
              <TextField
                label="Price Per Unit"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                type="number"
                required
              />
              <Typography>Upload Image (Optional):</Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && (
                <img
                  src={
                    typeof formData.image === "string"
                      ? `https://app.swabilaundry.ae/api/${formData.image}`
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Uploaded"
                  style={{ width: "50px", height: "50px", marginTop: "10px" }}
                />
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#007BFF", color: "#fff", ":hover": { backgroundColor: "#0056b3" } }}
            disabled={buttonLoading}
          >
            {buttonLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarType}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;
