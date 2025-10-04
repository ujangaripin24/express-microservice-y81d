import { loginService, meService } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const result = await meService(token);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
