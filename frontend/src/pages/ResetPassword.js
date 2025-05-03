"use client"

import { useState, useEffect } from "react"
import { Container, Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from "@mui/material"
import { Link, useParams, useNavigate } from "react-router-dom"
import api from "../services/api"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get(`/api/auth/reset-password/${token}`)
        setTokenValid(true)
      } catch (err) {
        setError("Invalid or expired password reset token")
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")

    try {
      await api.post(`/api/auth/reset-password/${token}`, { password })
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("Error resetting password:", err)
      setError(err.response?.data?.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 8, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Reset Password
          </Typography>

          {!tokenValid ? (
            <Box>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography align="center">
                <Link to="/forgot-password">Request a new password reset link</Link>
              </Typography>
            </Box>
          ) : success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your password has been successfully reset. You will be redirected to the login page.
              </Alert>
              <Typography align="center">
                <Link to="/login">Go to login</Link>
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Enter your new password below.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default ResetPassword
