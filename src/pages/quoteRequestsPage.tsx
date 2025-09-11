import React from "react";
import AdminLayout from "../components/AdminLayout";
import ServiceRequestsPage from "../crud/service-requests";

const QuoteRequestsPage = () => {
  return (
    <AdminLayout>
      <ServiceRequestsPage />
    </AdminLayout>
  );
};

export default QuoteRequestsPage;
