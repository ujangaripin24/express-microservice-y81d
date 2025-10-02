import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { createProxyMiddleware } from 'http-proxy-middleware'
dotenv.config()

const app = express()
const PORT = process.env.PORT_APP

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// service user
app.use("/api/v1/users", createProxyMiddleware({
    target: "http://localhost:8051",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/users": "/api/v1/web/users" }
}))

// service auth
app.use("/api/v1/auth", createProxyMiddleware({
    target: "http://localhost:8052",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "/api/v1/web/auth" }
}))

// service product
app.use("/api/v1/product", createProxyMiddleware({
  target: "http://localhost:8053",
  changeOrigin: true,
  pathRewrite: { "^/api/v1/product": "/api/v1/web/product" }
}));

app.get("/", (req, res) => {
    res.json({ msg: "API Gateway running 🚀" });
});

app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});