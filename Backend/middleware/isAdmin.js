// Middleware to check if user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Check if user has admin role
    // For simplicity, we're checking if the email is admin@example.com
    // In a real application, you would have a role field in your user model
    if (req.user.email === "admin@example.com") {
      next()
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
