"use client";
import React, { useState, useEffect } from "react";
import {
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        (user.status === "1" ? "Active" : "Inactive").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1);
  }, [search, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://app.swabilaundry.ae/api/get_users.php");
      if (response.data.status === "success") {
        setUsers(response.data.users || []);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setStatus(user.status); // status will be "1" or "0"
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const normalizedStatus = status === "Active" ? "1" : "0"; // Normalize to "1" or "0"
      const response = await axios.post(
        "https://app.swabilaundry.ae/api/update_user_status.php",
        {
          user_id: selectedUser.id,
          status: normalizedStatus, // Pass normalized status
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.status === "success") {
        setSnackbarMessage("User status updated successfully!");
        setSnackbarOpen(true);
        fetchUsers();
      } else {
        setSnackbarMessage("Failed to update user status.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      setSnackbarMessage("An error occurred while updating the user status.");
      setSnackbarOpen(true);
    } finally {
      setEditDialogOpen(false);
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ padding: 3 }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          User Management
        </Typography>
        <TextField
          label="Search Users"
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#007BFF" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Full Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Contact Number</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Balance</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.status === "1" ? "Active" : "Inactive"}</TableCell>
                <TableCell>{user.contact_no || "N/A"}</TableCell>
                <TableCell>{user.balance || "0"}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} sx={{ marginRight: 1 }}>
                    <FaEdit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredUsers.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
      />

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit-user-dialog-title"
      >
        <DialogTitle id="edit-user-dialog-title">
          Edit User
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Username:</strong> {selectedUser?.username || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Full Name:</strong> {selectedUser?.fullname || "N/A"}
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value); // Update the status state
                setSelectedUser((prevUser) => ({
                  ...prevUser,
                  status: e.target.value, // Update the selectedUser object
                }));
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{
              backgroundColor: "#E3B505",
              color: "black",
              ":hover": { backgroundColor: "#d3a004" },
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserComponent;
