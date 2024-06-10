import axios from 'axios';
import { AppDataSource } from '../config/database';
import { IpInfo } from '../entity/ipInfo';
import { Repository } from 'typeorm';

const IPWHOIS_API_URL = process.env.IPWHOIS_API_KEY || 'https://ipwhois.app/json/';

class IpService {

    private ipInfoRepository: Repository<IpInfo>;
    private cacheTTL: number = 60 * 1000; // 60 seconds

    constructor() {
        this.ipInfoRepository = AppDataSource.getRepository(IpInfo);
      }

    async getIpInfo(ip: string) {

        // Check cache
        const cached = await this.ipInfoRepository.findOne({ where: { ip } });

        if (cached && (new Date().getTime() - new Date(cached.updatedAt).getTime()) < this.cacheTTL) {
            console.log('Return record from cache')
            return JSON.parse(cached.data);
        }

        // Fetch from API
        console.log('Fetching IP info from API')
        const response = await axios.get(`${IPWHOIS_API_URL}${ip}`);

        if(!response.data.success) {
            throw new Error("Error fetching IP info: " + response.data.message)
        }

        const data = response.data;

        // Update cache
        if (cached) {
            console.log('Update cache')
            cached.data = JSON.stringify(data);
            cached.updatedAt = new Date();
            await this.ipInfoRepository.save(cached);
        } else {
            const newCache = this.ipInfoRepository.create({ ip, data: JSON.stringify(data) });
            await this.ipInfoRepository.save(newCache);
        }

        return data;
    }

    async removeIpCache(ip: string) {

        console.log('Check for Ip exist in the DB.')
        const isIpExist = await this.ipInfoRepository.exist({ where: { ip } });

        if(!isIpExist) {
            throw new Error('IP not found in cache.');
        }

        console.log('Delete the Ip Info.')
        await this.ipInfoRepository.delete({ ip });

    }
}

export default IpService;
