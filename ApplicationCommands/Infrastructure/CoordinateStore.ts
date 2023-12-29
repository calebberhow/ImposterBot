import Coordinate from './Coordinate.js';

// The coordinate store interfaces directly with the postgreSQL server, and exposes a simple API for callers to use to view / modify coordinate data.
class CoordinateStore
{
  pgClient;

  constructor(pgClient)
  {
    this.pgClient = pgClient;
  }

  async AddCoordinate(coordinate: Coordinate, guild_id: string): Promise<boolean>
  {
    try
    {
      await this.pgClient.query('INSERT INTO "Minecraft"."Coordinates"(id, x, y, z, dimension) VALUES ($1, $2, $3, $4, $5) WHERE guild_id=$6', [coordinate.id, coordinate.x, coordinate.y, coordinate.z, coordinate.dimension, guild_id]);
    }
    catch (e)
    {
      return false;
    }

    return true;
  }

  async GetCoordinate(coordinate_id: string, guild_id: string): Promise<Coordinate | null>
  {
    try
    {
      var query = await this.pgClient.query('SELECT * FROM "Minecraft"."Coordinates" WHERE id=$1::text AND guild_id=$2 LIMIT 1', [coordinate_id, guild_id]);
    }
    catch (e)
    {
      return null;
    }

    if (query.rows.length > 0)
    {
      return query.rows[0];
    }

    return null;
  }

  async GetAll(guild_id: string): Promise<Coordinate[]>
  {
    try
    {
      var query = await this.pgClient.query('SELECT * FROM "Minecraft"."Coordinates" WHERE guild_id=$1 ORDER BY id ASC', [guild_id]);
    }
    catch (e)
    {
      return [];
    }

    if (query.rows == undefined)
    {
      return [];
    }

    return query.rows as Coordinate[];
  }

  async ModifyCoordinate(coordinate: Coordinate, guild_id: string): Promise<boolean>
  {
    try
    {
      await this.pgClient.query('UPDATE "Minecraft"."Coordinates" SET x=$2, y=$3, z=$4, dimension=$5 WHERE id=$1 AND guild_id=$6', [coordinate.id, coordinate.x, coordinate.y, coordinate.z, coordinate.dimension, guild_id]);
    }
    catch (e)
    {
      return false;
    }
    return true;
  }

  async Remove(coordinate_id: string, guild_id: string): Promise<boolean>
  {
    try
    {
      await this.pgClient.query('DELETE FROM "Minecraft"."Coordinates" WHERE id=$1 AND guild_id=$2', [coordinate_id, guild_id]);
    }
    catch (e)
    {
      return false;
    }
    return true;
  }

  async Clear(guild_id: string): Promise<boolean>
  {
    try
    {
      await this.pgClient.query('DELETE FROM "Minecraft"."Coordinates" WHERE guild_id=$1', [guild_id]);
    }
    catch (e)
    {
      console.log(e);
      return false;
    }

    return true;
  }
}

export default CoordinateStore;