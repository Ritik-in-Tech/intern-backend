import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes";
import videoRoutes from "./routes/video.routes";
import facilityRoutes from "./routes/facility.routes";
import managerRoutes from "./routes/manager.routes";
import userRoutes from "./routes/user.routes";
import trainerRoutes from "./routes/trainer.routes";
import viewingHistoryRoutes from "./routes/viewinghistory.routes";
import tagRoutes from "./routes/videotag.routes";
import tagMappingRoutes from "./routes/videotagmapping.routes";
import trainingHistoryRoutes from "./routes/traininghistory.routes";
import reportRoutes from "./routes/report.routes";
import companyRoutes from "./routes/company.routes";
import passwordRoutes from "./routes/password.routes";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello express\n");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/facility", facilityRoutes);
app.use("/api/v1/managers", managerRoutes);
app.use("/api/v1/facilities", facilityRoutes);
app.use("/api/v1/trainers", trainerRoutes);
app.use("/api/v1/viewing-history", viewingHistoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/videoTags", tagMappingRoutes);
app.use("/api/v1/training-history", trainingHistoryRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/password", passwordRoutes);

export default app;
