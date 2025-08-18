import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/authApi';

type Inputs = {
  userName: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res.message === 'LOGIN_SUCCESSFUL') navigate('/dashboard');
    },
  });

  const formSubmit: SubmitHandler<Inputs> = async (res) => {
    mutate(res);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          fontWeight="bold"
          color="text.primary"
          mb={3}
        >
          Sign in to your account
        </Typography>

        {isError && (
          <Typography color="error" align="center" mt={2}>
            ❌{(error as any)?.response?.data?.message}
          </Typography>
        )}

        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(formSubmit)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Email ID / User Name"
            type="text"
            autoFocus
            {...register('userName', {
              required: 'This field is required',
            })}
          />
          {errors.userName && (
            <Typography className="error-text">
              {errors.userName.message}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'This field is required',
            })}
          />
          {errors.password && (
            <Typography className="error-text">
              {errors.password.message}
            </Typography>
          )}

          <Box textAlign="right" mt={1}>
            <Link
              component={NavLink}
              to="/forgot-password"
              variant="body2"
              underline="hover"
              color="primary"
            >
              Forgot your password?
            </Link>
          </Box>

          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2 }}
          >
            Sign In
          </Button> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2 }}
            disabled={isPending}
          >
            {isPending ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={3}
        >
          Don’t have an account?{' '}
          <Link
            component={NavLink}
            to="/register"
            underline="hover"
            color="primary"
            fontWeight="medium"
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
