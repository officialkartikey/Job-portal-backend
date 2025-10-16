import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../model/usermodel.js'; 


function validatePassword(password) {
  // Must have min 8 chars, 1 upper, 1 lower, 1 number, 1 special
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );
};

// ✅ Register user
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 chars long, include uppercase, lowercase, number, and special character.",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login user
// email , password 
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email" });

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
