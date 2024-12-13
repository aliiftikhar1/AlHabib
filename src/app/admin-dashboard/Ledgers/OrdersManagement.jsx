"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  TextField,
  Stack,
  Pagination,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(""); // To store the selected status
  const [statusLoading, setStatusLoading] = useState(false); // For loading state while updating status
  const itemsPerPage = 5;

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://app.swabilaundry.ae/api/get_orders.php");
      if (response.data.status === "success") {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("order_id", orderId);

      const response = await axios.post(
        "https://app.swabilaundry.ae/api/get_orderitems.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setOrderDetails(response.data.data);
        setDetailsDialogOpen(true);
        setNewStatus(response.data.data.orders.order_status); // Pre-set the current order status
      } else {
        console.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle search filter
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.order_id.toString().includes(search.toLowerCase()) ||
        order.username.toLowerCase().includes(search.toLowerCase()) ||
        order.status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
    setPage(1);
  }, [search, orders]);

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Update order status
  const handleStatusChange = async (orderId) => {
    if (!newStatus) return;

    setStatusLoading(true); // Show loading spinner while updating status

    try {
      const response = await axios.post("https://app.swabilaundry.ae/api/update_order_status.php", {
        order_id: orderId,
        status: newStatus,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        setSnackbarMessage("Order status updated successfully!");
        setSnackbarOpen(true);
        fetchOrders(); // Refresh orders list
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setStatusLoading(false); // Hide the loading spinner after update
    }
  };

  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ padding: 3 }}>
      {loading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Orders Management
        </Typography>
        <TextField
          label="Search Orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
      </Stack>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#007BFF" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Full Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.fullname || "N/A"}</TableCell>
                <TableCell>
                  {order.address
                    ? `${order.address}${order.city ? `, ${order.city}` : ""}`
                    : "N/A"}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total_amount}</TableCell>
                <TableCell>{order.created_at}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => fetchOrderDetails(order.order_id)}
                    sx={{ ":hover": { backgroundColor: "#E6F0FF" } }}
                  >
                    <FaEye />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredOrders.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
      />

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Order Details
          <IconButton
            onClick={() => setDetailsDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            X
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <>
              {/* Order Information, User Information, Pickup Address in a Single Row */}
              <Grid container spacing={3}>
                {/* Order Information */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    Order Information
                  </Typography>
                  <Typography>Order ID: {orderDetails.orders.order_id}</Typography>
                  <Typography>Status: {orderDetails.orders.order_status}</Typography>
                  <Typography>Total Amount: {orderDetails.orders.order_total_amount}</Typography>
                  <Typography>Created At: {orderDetails.orders.order_created_at}</Typography>
                </Grid>

                {/* User Information */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    User Information
                  </Typography>
                  <Typography>Username: {orderDetails.users.username}</Typography>
                  <Typography>Full Name: {orderDetails.users.fullname}</Typography>
                  <Typography>Contact: {orderDetails.users.user_contact_number || "N/A"}</Typography>
                  <Typography>Address: {orderDetails.users.user_address}</Typography>
                </Grid>

                {/* Pickup Address */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    Pickup Address
                  </Typography>
                  {orderDetails.pickup_addresses ? (
                    <Box>
                      <Typography>Street: {orderDetails.pickup_addresses.street_address}</Typography>
                      <Typography>City: {orderDetails.pickup_addresses.pickup_city}</Typography>
                      <Typography>State: {orderDetails.pickup_addresses.state}</Typography>
                      <Typography>Contact: {orderDetails.pickup_addresses.pickup_contact_number}</Typography>
                    </Box>
                  ) : (
                    <Typography>No Pickup Address Available</Typography>
                  )}
                </Grid>
              </Grid>

              {/* Order Items */}
              <Typography variant="h6" sx={{ marginTop: 3 }}>
                Order Items
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.order_items.map((item) => (
                      <TableRow key={item.item_id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.price_per_unit}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.item_total_price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Status Change */}
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Process">In Process</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusChange(orderDetails.orders.order_id)}
                    disabled={statusLoading}
                  >
                    {statusLoading ? "Updating..." : "Update Status"}
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography>Loading order details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersManagement;
