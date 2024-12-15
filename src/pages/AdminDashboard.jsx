import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Layout from '../components/Layout.jsx';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [websiteStats, setWebsiteStats] = useState({
    visitors: 4320,
    pageViews: 15350,
    uniqueVisitors: 1890,
    bounceRate: '35%',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchProjects();
    fetchServices();
    fetchEmployees();
  }, []);

  const fetchProjects = () => {
    axios
      .get('http://localhost:8080/api/projects')
      .then((response) => {
        setProjects(response.data.length ? response.data : getDummyProjects());
      })
      .catch(() => {
        setProjects(getDummyProjects());
      });
  };

  const fetchServices = () => {
    axios
      .get('http://localhost:8080/api/services')
      .then((response) => {
        setServices(response.data.length ? response.data : getDummyServices());
      })
      .catch(() => {
        setServices(getDummyServices());
      });
  };

  const fetchEmployees = () => {
    axios
      .get('http://localhost:8080/api/employees')
      .then((response) => {
        setEmployees(response.data.length ? response.data : getDummyEmployees());
      })
      .catch(() => {
        setEmployees(getDummyEmployees());
      });
  };

  const getDummyProjects = () => [
    { _id: '1', title: 'Solar Park Installation', completedTasks: 18, pendingTasks: 4, overview: 80 },
    { _id: '2', title: 'Residential Solar System', completedTasks: 10, pendingTasks: 2, overview: 90 },
    { _id: '3', title: 'Industrial Solar Grid', completedTasks: 22, pendingTasks: 6, overview: 78 },
  ];

  const getDummyServices = () => [
    { _id: '1', service: 'Maintenance Service', description: 'Regular maintenance for solar panels.' },
    { _id: '2', service: 'Energy Audit', description: 'Analyze energy usage to optimize performance.' },
    { _id: '3', service: 'Installation Consultation', description: 'Customized solar solutions for clients.' },
  ];

  const getDummyEmployees = () => [
    { _id: '1', name: 'Alice Green', jobTitle: 'Project Manager', description: 'Oversees solar projects.' },
    { _id: '2', name: 'John Smith', jobTitle: 'Solar Technician', description: 'Handles installations and repairs.' },
    { _id: '3', name: 'Maria Lopez', jobTitle: 'Energy Analyst', description: 'Conducts energy audits.' },
  ];

  const barData = {
    labels: projects.length ? projects.map((project) => project.title) : ['Dummy Project A', 'Dummy Project B', 'Dummy Project C'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: projects.length ? projects.map((project) => project.completedTasks || 0) : [10, 8, 15],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Pending Tasks',
        data: projects.length ? projects.map((project) => project.pendingTasks || 0) : [5, 7, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const doughnutData = {
    labels: projects.length ? projects.map((project) => project.title) : ['Dummy Project A', 'Dummy Project B', 'Dummy Project C'],
    datasets: [
      {
        label: 'Projects Overview',
        data: projects.length ? projects.map((project) => project.overview || 0) : [50, 40, 70],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const websiteStatsData = {
    labels: ['Visitors', 'Page Views', 'Unique Visitors', 'Bounce Rate'],
    datasets: [
      {
        label: 'Website Statistics',
        data: [websiteStats.visitors, websiteStats.pageViews, websiteStats.uniqueVisitors, parseFloat(websiteStats.bounceRate)],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const recentActivitiesData = {
    labels: ['User A', 'User B', 'Project D'],
    datasets: [
      {
        label: 'Recent Activities',
        data: [3, 1, 1],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Track progress, manage projects, and view analytics to ensure the company's success in delivering cutting-edge solar solutions.
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Typography variant="h6">Total Projects</Typography>
            <Typography variant="h4">{projects.length}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Typography variant="h6">Services Offered</Typography>
            <Typography variant="h4">{services.length}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Typography variant="h6">Employees</Typography>
            <Typography variant="h4">{employees.length}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">12</Typography>
          </StyledPaper>
        </Grid>

{/*       
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Task Status by Project
            </Typography>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </StyledPaper>
        </Grid>

    
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Project Completion Overview
            </Typography>
            <Doughnut data={doughnutData} />
          </StyledPaper>
        </Grid> */}

        {/* Website Statistics */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Website Statistics
            </Typography>
            <Bar data={websiteStatsData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </StyledPaper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Line data={recentActivitiesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </StyledPaper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminDashboard;