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
} from "@mui/material";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const CategoryManagement = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false); // Global loading spinner
  const [buttonLoading, setButtonLoading] = useState(false); // Save button spinner
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSubmit, setSnackbarSubmit] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [filter, setFilter] = useState(""); // Search filter
  const [page, setPage] = useState(1); // Pagination
  const itemsPerPage = 5; // Number of items per page
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [deleteCategoryId, setDeleteCategoryId] = useState(null); // ID for deletion

  // Fetch categories from the server
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://app.swabilaundry.ae/api/get_categories.php");
      if (response.data.status === "success") {
        setCategories(response.data.data);
        setFilteredCategories(response.data.data); // Initially set to all categories
      } else {
        console.error("Failed to fetch categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search input
  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(filter.toLowerCase()) ||
        category.description.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCategories(filtered);
    setPage(1); // Reset to the first page after filtering
  }, [filter, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    if (!formData.name || !formData.description) {
      setSnackbarSubmit(true);
      setTimeout(() => setSnackbarSubmit(false), 5000);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    setButtonLoading(true);
    try {
      let response;
      if (formData.id) {
        // Edit category
        data.append("category_id", formData.id);
        response = await axios.post("https://app.swabilaundry.ae/api/edit_category.php", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new category
        response = await axios.post("https://app.swabilaundry.ae/api/add_category.php", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.status === "success") {
        fetchCategories(); // Refresh category list
        setSnackbarOpen(true); // Show success notification
        handleClose(); // Close modal and reset form
      } else {
        console.error("Failed to submit form:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.category_id,
      name: category.name,
      description: category.description,
      image: category.imgurl || null, // Use existing image URL
    });
    setModelOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteCategoryId(id);
    setDeleteDialogOpen(true); // Open delete confirmation dialog
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://app.swabilaundry.ae/api/delete_category.php",
        { category_id: deleteCategoryId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        setCategories((prev) => prev.filter((cat) => cat.category_id !== deleteCategoryId));
        setDeleteDialogOpen(false); // Close dialog
        setSnackbarOpen(true); // Show success notification
      } else {
        console.error("Failed to delete category:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModelOpen(false);
    setFormData({ id: "", name: "", description: "", image: null }); // Reset form
  };

  const handlePageChange = (event, value) => setPage(value);

  const paginatedCategories = filteredCategories.slice(
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
          label="Search Categories"
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
          Add New Category
        </Button>
      </Stack>

      {/* Category Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead sx={{ backgroundColor: "#0890F1" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.category_id}>
                <TableCell>{category.category_id}</TableCell>
                <TableCell>
                  {category.imgurl && (
                    <img
                      src={`https://app.swabilaundry.ae/api/${category.imgurl}`}
                      alt="Category"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)} sx={{ color: "#007BFF" }}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(category.category_id)} sx={{ color: "#FF4C4C" }}>
                    <FaTrashAlt />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredCategories.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category? This action cannot be undone.</Typography>
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
          <Typography variant="h6">{formData.id ? "Edit Category" : "Add New Category"}</Typography>
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
              <TextField
                label="Category Name"
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
        <Alert severity="success">Category updated successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={snackbarSubmit}
        autoHideDuration={5000}
        onClose={() => setSnackbarSubmit(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">Please fill in all the required fields.</Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagement;
