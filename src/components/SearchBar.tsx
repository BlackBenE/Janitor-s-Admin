import {
  FC,
  ChangeEvent,
  useState,
  useCallback,
  memo,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { Box } from "@mui/material";
import SearchResults from "./SearchResults";
import {
  searchEntities,
  useSearchNavigation,
  SearchResult,
} from "../services/searchService";
import { LABELS } from "../constants/labels";

interface SearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  minWidth?: string;
  expandedWidth?: string;
  className?: string;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#fafafabf",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus-within": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(memo(InputBase))(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchBar: FC<SearchBarProps> = ({
  placeholder = LABELS.searchBar.placeholder,
  debounceMs = 300,
  minWidth = "12ch",
  expandedWidth = "20ch",
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { handleSearchResultClick } = useSearchNavigation();

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.length >= 2) {
      try {
        const searchResults = await searchEntities(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, []);

  const debouncedSearchWithDelay = useMemo(
    () => debounce(debouncedSearch, debounceMs),
    [debouncedSearch, debounceMs]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    debouncedSearchWithDelay(newValue);
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearchResultClick(result);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <Box ref={searchRef} sx={{ position: "relative" }}>
      <Search className={className}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          inputProps={{
            "aria-label": LABELS.searchBar.ariaLabel,
            style: {
              minWidth,
            },
          }}
          sx={{
            "& .MuiInputBase-input:focus": {
              width: expandedWidth,
            },
          }}
        />
      </Search>
      <SearchResults
        results={results}
        onResultClick={handleResultClick}
        visible={showResults}
      />
    </Box>
  );
};

export default SearchBar;
