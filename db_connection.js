import { createPool } from 'mysql2/promise';

const connectionParams = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'multihilos',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 2
}

export const pool = createPool(connectionParams);