import { FC } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ClickMenu from "./ClickMenu";
import Typography from "@mui/material/Typography";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useNavigate } from "react-router-dom";
import { ButtonProps } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface ProfileButtonProps {
  userName?: string;
  userEmail?: string;
  avatarSrc?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

interface MenuOption {
  label: string;
  onClick: () => void;
}

const defaultButtonStyle: SxProps<Theme> = {
  color: "black",
  border: "1px solid #ccc",
  borderRadius: 2,
  p: 0.5,
  minWidth: 36,
  minHeight: 36,
};

const ProfileButton: FC<ProfileButtonProps> = ({
  userName = "User Name",
  userEmail = "user@email.com",
  avatarSrc = "/logo.png",
  className,
  sx,
}) => {
  const navigate = useNavigate();

  const menuOptions: MenuOption[] = [
    { label: "Profile", onClick: () => navigate("/profile") },
    { label: "Settings", onClick: () => navigate("/settings") },
    { label: "Logout", onClick: () => navigate("/login") },
  ];

  const buttonProps: ButtonProps = {
    sx: defaultButtonStyle,
    "aria-label": "More options",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
      className={className}
    >
      <Avatar alt={userName} src={avatarSrc} sx={{ width: 44, height: 44 }} />
      <Box sx={{ m: 1, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userEmail}
        </Typography>
      </Box>
      <ClickMenu
        buttonLabel={<MoreVertOutlinedIcon />}
        buttonProps={buttonProps}
        menuItems={menuOptions}
      />
    </Box>
  );
};

export default ProfileButton;
