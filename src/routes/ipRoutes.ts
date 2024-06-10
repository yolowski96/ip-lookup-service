import { Router } from 'express';
import { getIpInfo, removeIpCache } from '../controller/ipController';

const router = Router();

/**
 * @swagger
 * /ip/{ip}:
 *   get:
 *     summary: Get IP information
 *     parameters:
 *       - in: path
 *         name: ip
 *         schema:
 *           type: string
 *         required: true
 *         description: IP address to lookup
 *     responses:
 *       200:
 *         description: IP information retrieved successfully
 *       500:
 *         description: Invalid IP address
 */
router.get('/ip/:ip', getIpInfo);

/**
 * @swagger
 * /ip/{ip}:
 *   delete:
 *     summary: Remove cached IP information
 *     parameters:
 *       - in: path
 *         name: ip
 *         schema:
 *           type: string
 *         required: true
 *         description: IP address to remove from cache
 *     responses:
 *       200:
 *         description: Cached IP information removed successfully
 *       404:
 *         description: Missing IP address in DB
 *       500:
 *         description: Invalid IP address
 */
router.delete('/ip/:ip', removeIpCache);

export default router;
