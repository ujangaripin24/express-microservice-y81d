'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};

const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config);

const files = fs.readdirSync(__dirname).filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
);

for (const file of files) {
    const modelPath = path.join(__dirname, file);
    const { default: model } = await import(`file://${modelPath}`);
    const definedModel = model(sequelize, Sequelize.DataTypes);
    db[definedModel.name] = definedModel;
}

for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;