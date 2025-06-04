// SQLPlayground/index.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box } from '@mui/material';
import { usePermission } from '../../rbac/context.jsx';
import QueryEditor from './QueryEditor';
import ResultsViewer from './ResultsViewer';
import SaveQueryButton from './SaveQueryButton';

export default function SQLPlayground() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canSaveQueries = usePermission('sql_playground', 'save');

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[400],
      minHeight: 'calc(100vh - 64px)',
      p: 4
    }}>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 4,
        maxWidth: '1800px',
        mx: 'auto'
      }}>
        <QueryEditor />
        <ResultsViewer />
      </Box>
      
      {canSaveQueries && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <SaveQueryButton />
        </Box>
      )}
    </Box>
  );
}