const config = {
  default: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DATABASE_URL || '127.0.0.1',
  },
  development: {
    extend: 'default',
    database: 'iic2513template_dev',
  },
  test: {
    extend: 'default',
    database: 'iic2513template_test',
  },
  production: {
    extend: 'default',
    database: 'dal12j2323icap',
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = Object.assign({}, config[configValue.extend], configValue);
  }
});

module.exports = config;
