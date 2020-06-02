import 'reflect-metadata';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Container, Page } from './models';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, '../data/database.sqlite'),
    logging: false
});

sequelize.addModels([ Container, Page ]);
sequelize.sync();

export default sequelize;