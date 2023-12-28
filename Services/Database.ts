import pg from 'pg';

const PostgresClient = new pg.Client({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'Cubone3',
	port: 5432
});

PostgresClient.connect();

export default PostgresClient;