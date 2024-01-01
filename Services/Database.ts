import pg from 'pg';

const clientPool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Cubone3',
  port: 5432
});

clientPool.on('error', (err: Error, _: any) =>
{
  console.log(err.message);
});

export default clientPool;