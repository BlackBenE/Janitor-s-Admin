import React from "react";
import AdminLayout from "../components/AdminLayout";
import UsersPage from "../crud/users";

const UserManagementPage = () => {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
};

export default UserManagementPage;
