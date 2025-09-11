import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CrudForm } from "../components/CrudForm";
import { Tables } from "../../types/database.types";

type Profile = Tables<"profiles">;

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const handleSave = (user: Profile) => {
    console.log("User saved:", user);
    navigate("/user-management");
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      required: true,
    },
    {
      name: "full_name",
      label: "Full Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text" as const,
    },
    {
      name: "role",
      label: "Role",
      type: "select" as const,
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Property Owner", value: "property_owner" },
        { label: "Traveler", value: "traveler" },
        { label: "Service Provider", value: "provider" },
      ],
    },
    {
      name: "profile_validated",
      label: "Profile Validated",
      type: "boolean" as const,
    },
    {
      name: "vip_subscription",
      label: "VIP Subscription",
      type: "boolean" as const,
    },
  ];

  return (
    <CrudForm<Profile>
      resource="profiles"
      id={id}
      title={isEdit ? "Edit User" : "Create User"}
      fields={fields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default UserForm;
