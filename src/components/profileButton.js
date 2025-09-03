import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ClickMenu from "./ClickMenu";
import Typography from "@mui/material/Typography";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

function ProfileButton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar alt="User Name" src="/logo.png" sx={{ width: 44, height: 44 }} />
      <Box sx={{ m: 1, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          User Name
        </Typography>
        <Typography variant="body2" color="text.secondary">
          user@email.com
        </Typography>
      </Box>
      <ClickMenu
        buttonLabel={<MoreVertOutlinedIcon />}
        buttonProps={{
          sx: {
            color: "black",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 0.5,
            minWidth: 36,
            minHeight: 36,
          },
          "aria-label": "More options",
        }}
        menuItems={[
          { label: "Profile", onClick: () => console.log("Profile") },
          { label: "My account", onClick: () => console.log("My account") },
          { label: "Logout", onClick: () => console.log("Logout") },
        ]}
      />
    </Box>
  );
}

export default ProfileButton;
