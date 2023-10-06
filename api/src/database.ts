import 'reflect-metadata';
import { fileURLToPath } from 'node:url';
import { Sequelize } from 'sequelize-typescript';
import { Container, Page } from './models/index.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: fileURLToPath(new URL('../data/database.sqlite', import.meta.url)),
    logging: false
});

sequelize.addModels([Container, Page]);
void sequelize.sync();

export default sequelize;
