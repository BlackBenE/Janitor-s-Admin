import { Box } from "@mui/material";
import Form, { FormField } from "../components/Form";

const loginFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 6,
  },
];

function Login() {
  const handleSubmit = async (data: Record<string, string>) => {
    try {
      // Add your login logic here
      console.log("Login attempt with:", data);
      // Example: await loginUser(data.email, data.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Form
        title="Login"
        fields={loginFields}
        onSubmit={handleSubmit}
        submitButtonText="Sign In"
      />
    </Box>
  );
}

export default Login;
