import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Layout from "../components/Layout.jsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import config from "../config";
import axios from "axios";

function QuotationRequests() {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchQuotes = () => {
    axios
      .get(`${config.baseUrl}/api/quote`)
      .then((response) => {
        setQuotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
        Swal.fire("Error", "Failed to fetch quotes", "error");
      });
  };

  const updateStatus = (id, status) => {
    axios
      .put(`${config.baseUrl}/api/quote/${id}/status`, { status })
      .then(() => {
        fetchQuotes();
        Swal.fire("Success", "Status updated successfully", "success");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        Swal.fire("Error", "Failed to update status", "error");
      });
  };


  const handleFlag = (id) => {
    axios.put(`${config.baseUrl}/api/quote/${id}/flag`)
      .then(() => {
        fetchQuotes();
        Swal.fire("Success", "Quote flagged successfully", "success");
      })
      .catch((error) => {
        console.error("Error flagging quote:", error);
        Swal.fire("Error", "Failed to flag quote", "error");
      });
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const totalPages = Math.ceil(quotes.length / itemsPerPage);
  const paginatedQuotes = quotes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Quote Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedQuotes.map((quote, index) => (
              <TableRow key={quote._id}>
                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{quote.name}</TableCell>
                <TableCell>{quote.email}</TableCell>
                <TableCell>{quote.service}</TableCell>
                <TableCell>
                  <Select
                    value={quote.status}
                    onChange={(e) => updateStatus(quote._id, e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleFlag(quote._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Layout>
  );
}

export default QuotationRequests;
