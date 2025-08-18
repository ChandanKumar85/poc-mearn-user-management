import { NavLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
} from '@mui/material';

const ForgotPassword = () => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        {/* Title */}
        <Typography
          component="h1"
          variant="h5"
          align="center"
          fontWeight="bold"
          color="text.primary"
          mb={1}
        >
          Forgot your password?
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={3}
        >
          Enter your registered email and we’ll send you a password reset link.
        </Typography>

        {/* Form */}
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
          >
            Send Reset Link
          </Button>
        </Box>

        {/* Back to Login */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={3}
        >
          Remember your password?{' '}
          <Link
            component={NavLink}
            to="/login"
            underline="hover"
            color="primary"
            fontWeight="medium"
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
