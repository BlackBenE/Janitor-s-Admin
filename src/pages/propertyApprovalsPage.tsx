import React from "react";
import AdminLayout from "../components/AdminLayout";
import PropertiesPage from "../crud/properties";

const PropertyApprovalsPage = () => {
  return (
    <AdminLayout>
      <PropertiesPage />
    </AdminLayout>
  );
};

export default PropertyApprovalsPage;
