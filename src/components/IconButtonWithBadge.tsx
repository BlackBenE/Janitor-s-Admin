import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

interface IconButtonWithBadgeProps
  extends React.ComponentProps<typeof IconButton> {
  icon: React.ElementType;
  badgeContent: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "default"
    | "error"
    | "info"
    | "success"
    | "warning";
}

function IconButtonWithBadge({
  icon: Icon,
  badgeContent,
  color = "primary",
  ...props
}: IconButtonWithBadgeProps) {
  return (
    <IconButton {...props}>
      <CustomBadge badgeContent={badgeContent} color={color} overlap="circular">
        <Icon fontSize="small" />
      </CustomBadge>
    </IconButton>
  );
}

export default IconButtonWithBadge;
