import axios from "axios";
import { IpInfo } from '../src/entity/ipInfo';
import { DataSource} from 'typeorm';
import IpService from '../src/service/ipService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const connectDB = new DataSource({
    type: 'sqlite',
    database: 'test.sqlite',
    synchronize: true,
    entities: [IpInfo],
});

describe('IpLookupService', () => {
  let ipLookupService: IpService;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await connectDB.initialize();
    ipLookupService = new IpService();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    await dataSource.getRepository(IpInfo).clear();
  });

  it('should fetch IP info from external API if not cached', async () => {
    const ip = '8.8.8.8';

    const apiResponse = {
      data: {
        "ip": ip,
        "success": true,
        "type": "IPv4",
        "continent": "Europe",
        "continent_code": "EU",
        "country": "Bulgaria",
      },
    };

    mockedAxios.get.mockResolvedValue(apiResponse);

    const ipInfo = new IpInfo();
    ipInfo.ip = ip;
    ipInfo.data = JSON.stringify(apiResponse.data);

    await dataSource.getRepository(IpInfo).save(ipInfo);

    const result = await ipLookupService.getIpInfo(ip);

    expect(result.ip).toMatch(apiResponse.data.ip);
    expect(result.type).toMatch(apiResponse.data.type);
    expect(result.continent).toMatch(apiResponse.data.continent);

    const cachedResult = await dataSource.getRepository(IpInfo).findOne({ where: { ip } });
    expect(cachedResult?.data).toMatch(JSON.stringify(apiResponse.data));

  });

  it('should remove cached IP info', async () => {
    const ip = '8.8.8.8';

    const apiResponse = {
      data: {
        "ip": ip,
        "success": true,
        "type": "IPv4",
        "continent": "Europe",
        "continent_code": "EU",
        "country": "Bulgaria",
      },
    };

    const ipInfo = new IpInfo();
    ipInfo.ip = ip;
    ipInfo.data= JSON.stringify(apiResponse.data);;

    await ipLookupService.getIpInfo(ip)

    await ipLookupService.removeIpCache(ip)

    const result = await dataSource.getRepository(IpInfo).findOne({ where: { ip } });

    expect(result).toBeNull();
  });
});
