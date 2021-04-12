const config = {
    /* don't expose password or any sensitive info, done only for demo */
    // if environment variables are not defined, use default values
    HOST: process.env.DB_HOST || 'sql11.freemysqlhosting.net',
    USER: process.env.DB_USER || 'sql11405167',
    PASSWORD: process.env.DB_PASSWORD || 'kqu965HyAa',
    DB: process.env.DB_NAME || 'sql11405167'
    };
    module.exports = config;