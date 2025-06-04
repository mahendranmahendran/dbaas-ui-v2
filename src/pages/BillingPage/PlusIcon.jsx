// BillingPage/PlusIcon.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';

export default function PlusIcon({ sx = {} }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.clickhouseBlue[500]}
      strokeWidth="2"
      style={{ width: 20, height: 20, ...sx }}
    >
      <path d="M12 4v16m8-8H4"/>
    </svg>
  );
}