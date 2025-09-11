import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useList } from "../../hooks/useCrud";
import { Database } from "../../types/database.types";

type ValidTableName = keyof Database["public"]["Tables"];

interface CrudListProps<T = Record<string, unknown>> {
  resource: ValidTableName;
  title: string;
  columns: {
    field: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, record: T) => React.ReactNode;
  }[];
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onCreate?: () => void;
  onView?: (record: T) => void;
  searchable?: boolean;
  filters?: Record<string, unknown>;
}

export function CrudList<T extends { id: string }>({
  resource,
  title,
  columns,
  onEdit,
  onDelete,
  onCreate,
  onView,
  searchable = true,
  filters = {},
}: CrudListProps<T>) {
  const [page, setPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<
    { field: string; order: "ASC" | "DESC" } | undefined
  >();

  const { data, meta, loading, error } = useList<T>(resource, {
    pagination: { page: page + 1, perPage },
    sort,
    filter: {
      ...filters,
      ...(search ? { search } : {}),
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev?.field === field && prev.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {onCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
          >
            Create New
          </Button>
        )}
      </Box>

      {/* Search */}
      {searchable && (
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  sortDirection={
                    sort?.field === column.field
                      ? (sort.order.toLowerCase() as "asc" | "desc")
                      : false
                  }
                >
                  {column.sortable ? (
                    <Button
                      onClick={() => handleSort(String(column.field))}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      {column.label}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.field)}>
                      {column.render
                        ? column.render(record[column.field], record)
                        : String(record[column.field] || "-")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {onView && (
                        <IconButton
                          size="small"
                          onClick={() => onView(record)}
                          title="View"
                        >
                          <ViewIcon />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(record)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(record)}
                          title="Delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {meta && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={meta.total}
            rowsPerPage={perPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>
    </Box>
  );
}
