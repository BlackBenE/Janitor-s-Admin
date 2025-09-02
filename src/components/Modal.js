import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function DataModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}

export default DataModal;
