import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  AccountBalance,
  Check,
  Clear,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { checkPasswordStrength } from '../services/authApi';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  username: yup
    .string()
    .min(3, 'Username should be at least 3 characters')
    .max(50, 'Username should be less than 50 characters')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    )
    .required('Username is required'),
  first_name: yup
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name should be less than 50 characters')
    .required('First name is required'),
  last_name: yup
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name should be less than 50 characters')
    .required('Last name is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const success = await register({
          email: values.email,
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          password: values.password,
        });

        if (success) {
          setSuccess(
            'Registration successful! Please check your email for verification instructions.'
          );
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError('Registration failed. Please try again.');
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          const detail = err.response?.data?.detail;
          if (detail === 'Email already registered') {
            setError(
              'This email is already registered. Please use a different email or try logging in.'
            );
          } else if (detail === 'Username already taken') {
            setError(
              'This username is already taken. Please choose a different username.'
            );
          } else {
            setError(
              detail ||
                'Registration failed. Please check your information and try again.'
            );
          }
        } else {
          setError('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const passwordStrength = checkPasswordStrength(formik.values.password);

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'error';
      case 'medium':
        return 'warning';
      case 'strong':
        return 'success';
      default:
        return 'primary';
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <AccountBalance sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
            >
              Join FinVision
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Create your account to start financial modeling
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={formik.handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  variant="outlined"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  helperText={
                    formik.touched.first_name && formik.errors.first_name
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="given-name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  variant="outlined"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.last_name && Boolean(formik.errors.last_name)
                  }
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="email"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="username"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="new-password"
                />

                {/* Password Strength Indicator */}
                {formik.values.password && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Password Strength:
                      </Typography>
                      <Chip
                        label={passwordStrength.strength.toUpperCase()}
                        color={getPasswordStrengthColor(
                          passwordStrength.strength
                        )}
                        size="small"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength.score / 5) * 100}
                      color={getPasswordStrengthColor(
                        passwordStrength.strength
                      )}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}
                    >
                      {Object.entries(passwordStrength.checks).map(
                        ([key, passed]) => (
                          <Chip
                            key={key}
                            label={key}
                            size="small"
                            icon={passed ? <Check /> : <Clear />}
                            color={passed ? 'success' : 'default'}
                            variant={passed ? 'filled' : 'outlined'}
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={isLoading || !passwordStrength.isValid}
              sx={{
                mt: 4,
                mb: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            © 2024 FinVision. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
