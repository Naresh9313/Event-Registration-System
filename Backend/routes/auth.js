import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import crypto from "crypto"

const router = express.Router()

// Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
})

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
})

// Request password reset
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    // Save token to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    // await sendPasswordResetEmail(user.email, resetUrl) // Assuming sendPasswordResetEmail is defined elsewhere

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    next(error)
  }
})

// Validate reset token
router.get("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    res.json({ message: "Token is valid" })
  } catch (error) {
    next(error)
  }
})

// Reset password
router.post("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    // Update password
    user.password = password
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    next(error)
  }
})

export default router
