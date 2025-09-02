import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

function IconButtonWithBadge({
  icon: Icon,
  badgeContent,
  color = "primary",
  ...props
}) {
  return (
    <IconButton {...props}>
      <CustomBadge badgeContent={badgeContent} color={color} overlap="circular">
        <Icon fontSize="small" />
      </CustomBadge>
    </IconButton>
  );
}

export default IconButtonWithBadge;
