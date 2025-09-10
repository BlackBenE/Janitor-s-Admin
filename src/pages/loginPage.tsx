import { Box } from "@mui/material";
import Form, { FormField } from "../components/Form";
import { useAuth } from "../hooks/useAuth";

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
  const { signIn } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      await signIn(data.email, data.password);
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
