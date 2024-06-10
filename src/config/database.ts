import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { IpInfo } from '../entity/ipInfo';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_DATABASE || 'ipinfo.sqlite',
    synchronize: true,
    entities: [IpInfo],
})

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });