import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
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
      <IconButton
        aria-label="More options"
        sx={{
          color: "black",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 0.5,
          minWidth: 36,
          minHeight: 36,
        }}
      >
        <MoreVertOutlinedIcon />
      </IconButton>
    </Box>
  );
}

export default ProfileButton;
