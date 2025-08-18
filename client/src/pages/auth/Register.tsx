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
import { registerUser } from '../../api/authApi';
import { useMutation } from '@tanstack/react-query';

type Inputs = {
  userName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();

  const passwordValue = watch('password');

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      if (res.message === 'USER_REGISTERED') navigate('/login');
      console.log(res);
    },
  });

  const formSubmit: SubmitHandler<Inputs> = async ({
    confirmPassword,
    ...rest
  }) => {
    mutate(rest);
    console.log(rest);
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
          Create your account
        </Typography>

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
            label="User Name"
            type="text"
            placeholder="John Doe"
            autoFocus
            {...register('userName', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'User Name must be at least 3 characters',
              },
              validate: (value) =>
                /^[A-Za-z\s]+$/.test(value) ||
                'User Name should not contain numbers',
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
            id="emailId"
            label="Email Address"
            type="emailId"
            placeholder="you@example.com"
            autoComplete="emailId"
            {...register('emailId', {
              required: 'This field is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.emailId && (
            <Typography className="error-text">
              {errors.emailId.message}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="Enter Phone Number"
            autoComplete="phone"
            {...register('phoneNumber', {
              required: 'This field is required',
              maxLength: {
                value: 10,
                message: 'Phone number should max 10 digits',
              },
              minLength: {
                value: 10,
                message: 'Phone number should min 10 digits',
              },
            })}
          />
          {errors.phoneNumber && (
            <Typography className="error-text">
              {errors.phoneNumber.message}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password', {
              required: 'This field is required',
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                message:
                  'Password must be at least 8 characters, include 1 uppercase, 1 number & 1 special character',
              },
            })}
          />
          {errors.password && (
            <Typography className="error-text">
              {errors.password.message}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'This field is required',
              validate: (value) =>
                value === passwordValue || 'Password not matched',
            })}
          />
          {errors.confirmPassword && (
            <Typography className="error-text">
              {errors.confirmPassword.message}
            </Typography>
          )}

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
              'Register'
            )}
          </Button>
        </Box>

        {/* FEEDBACK STATES */}
        {isError && (
          <Typography color="error" align="center" mt={2}>
            ❌{(error as any)?.response?.data?.message}
          </Typography>
        )}
        {isSuccess && (
          <Typography color="success.main" align="center" mt={2}>
            ✅ Registration successful!
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={3}
        >
          Already have an account?{' '}
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

export default Register;
