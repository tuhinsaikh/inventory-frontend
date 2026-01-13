import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { GitHub as GitHubIcon, Email as EmailIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} RetailShop Inventory Management System. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Link
              href="#"
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <EmailIcon fontSize="small" />
              support@retailshop.com
            </Link>

            <Link
              href="#"
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <GitHubIcon fontSize="small" />
              GitHub
            </Link>

            <Typography variant="body2" color="text.secondary">
              v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          mt={2}
        >
          Built with React, Material-UI, and Spring Boot
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;