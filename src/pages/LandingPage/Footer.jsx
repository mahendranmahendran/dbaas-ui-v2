// LandingPage/Footer.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const footerLinks = [
  {
    title: "About Us",
    link: "/about"
  },
  {
    title: "Contact Us",
    link: "/contact"
  },
  {
    title: "Features",
    link: "/features"
  },
  {
    title: "Blog",
    link: "/blog"
  },
  {
    title: "Terms of Service",
    link: "/terms"
  },
  {
    title: "Privacy Policy",
    link: "/privacy"
  },
  {
    title: "Security",
    link: "/security"
  },
  {
    title: "Cookie Policy",
    link: "/cookies"
  },
  {
    title: "Support",
    link: "/support"
  }
];

export default function Footer() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[500],
      py: 4,
      px: 4,
      mt: 8
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Footer Links */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          mb: 4
        }}>
          {footerLinks.map((link) => (
            <MuiLink
              key={link.title}
              href={link.link}
              sx={{
                color: colors.grey[300],
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: colors.clickhouseBlue[400]
                }
              }}
            >
              {link.title}
            </MuiLink>
          ))}
        </Box>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: colors.grey[500],
            mt: 4
          }}
        >
          © {new Date().getFullYear()} ClickHouse DBaaS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
