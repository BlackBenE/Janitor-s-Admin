import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import React, { useState } from "react";

function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState("");

  const handleClick = () => setModalOpen(true);
  const handleChange = (e) => setFieldValue(e.target.value);
  const handleSave = () => {
    // save logic here
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <Box>
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening with your platform today.</p>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Pending Property Validations"
            icon={ApartmentOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            onClick={handleClick}
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Provider Moderation Cases"
            icon={HowToRegOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            onClick={handleClick}
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Active Users"
            icon={GroupOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            onClick={handleClick}
            sx={{ flex: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <InfoCard
            title="Monthly Revenue"
            icon={EuroOutlinedIcon}
            value={1200}
            bottomLeft="Active this month"
            progressText="75% growth"
            showTrending={false}
            progressTextColor="text.secondary"
            onClick={handleClick}
            sx={{ flex: 1 }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default DashboardPage;
