import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';

export default function ResultsViewer() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Sample data - replace with your actual query results
  const results = {
    columns: ['id', 'name', 'email'],
    rows: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[500],
      borderRadius: '4px',
      p: 3,
      height: '500px',
      overflow: 'auto'
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
        Results
      </Typography>
      
      {results.rows.length > 0 ? (
        <TableContainer component={Paper} sx={{ 
          backgroundColor: colors.primary[400],
          maxHeight: '400px'
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {results.columns.map((column) => (
                  <TableCell key={column} sx={{ 
                    backgroundColor: colors.primary[600],
                    color: colors.grey[100]
                  }}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.rows.map((row, index) => (
                <TableRow key={index}>
                  {results.columns.map((column) => (
                    <TableCell key={column} sx={{ color: colors.grey[100] }}>
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: colors.grey[300]
        }}>
          <Typography>No results to display. Run a query to see results.</Typography>
        </Box>
      )}
    </Box>
  );
}