const config = {
    development: {
        // Add your development configurations here
    },
    production: {
        // Add your production configurations here
    },
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];