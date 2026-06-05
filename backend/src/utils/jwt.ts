import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(data: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(data, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
