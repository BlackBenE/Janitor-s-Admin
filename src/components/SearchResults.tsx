import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HandymanIcon from "@mui/icons-material/Handyman";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import BusinessIcon from "@mui/icons-material/Business";
import { SearchResult } from "../services/searchService";

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  visible: boolean;
}

const getIconForType = (type: SearchResult["type"]) => {
  switch (type) {
    case "user":
      return <PersonIcon />;
    case "property":
      return <HomeWorkIcon />;
    case "service":
      return <HandymanIcon />;
    case "invoice":
      return <ReceiptIcon />;
    case "quote":
      return <RequestQuoteIcon />;
    case "provider":
      return <BusinessIcon />;
    default:
      return null;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onResultClick,
  visible,
}) => {
  if (!visible || results.length === 0) return null;

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        mt: 1,
        maxHeight: "400px",
        overflow: "auto",
        zIndex: 1300,
        boxShadow: 3,
      }}
    >
      <List>
        {results.length === 0 ? (
          <ListItem>
            <ListItemText primary="No results found" />
          </ListItem>
        ) : (
          results.map((result) => (
            <ListItem
              key={`${result.type}-${result.id}`}
              onClick={() => onResultClick(result)}
              component="div"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon>{getIconForType(result.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" component="div">
                    {result.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {result.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {result.type}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default SearchResults;
