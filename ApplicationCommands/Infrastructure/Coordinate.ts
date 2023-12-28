class Coordinate 
{
	id: string;
	x: number;
	y: number | null;
	z: number;
	dimension: string | null;

	constructor(id: string, x: number, z: number,  y: number | null = null, dimension: string | null = null) 
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.dimension = dimension;
	}
}

export default Coordinate;