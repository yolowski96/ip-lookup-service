import express from "express";
import ipRoutes from "./routes/ipRoutes";
import { setupSwagger } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

setupSwagger(app);

app.use(express.json());
app.use("/", ipRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
