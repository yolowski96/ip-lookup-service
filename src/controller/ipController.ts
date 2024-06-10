import { Request, Response } from "express";
import IpService from "../service/ipService";

const ipService = new IpService();

export const getIpInfo = async (req: Request, res: Response) => {
  const ip = req.params.ip;
  try {
    const data = await ipService.getIpInfo(ip);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch IP info" });
  }
};

export const removeIpCache = async (req: Request, res: Response) => {
  const ip = req.params.ip;
  try {
    await ipService.removeIpCache(ip);
    res.json({ message: "Cache removed" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "IP not found in cache.") {
        res.status(404).json({ error: error.message });
      }
    }

    res.status(500).json({ error: "Failed to remove cache" });
  }
};
