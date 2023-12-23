import mc from "minecraftstatuspinger";
import Discord, { ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import colors from "../../util/colors.js";
import { ServerStatus } from "minecraftstatuspinger/dist/types.js";
import ApplicationCommand from "../Infrastructure/ApplicationCommand.js";

const MCServerIP = "cozycosmos.serveminecraft.net";
const MCServerPort = 25565;

const COMMAND_SERVER = 'server_info';
const COMMAND_COORDINATES = 'coordinates';
const COMMAND_RECORDCOORDINATE = 'record_coorindate';
const COMMAND_MODIFYCOORDINATE = 'modify_coordinate';
const COORDINATE_DESCRIPTION = 'coordinate_name';
const COORDINATE_X = 'coordinate_x';
const COORDINATE_Y = 'coordinate_y';
const COORDINATE_Z = 'coordinate_z';
const COORDINATE_DIMENSION = 'coordinate_dimension';

class CoordinateStore
{
	coordinates:Array<Coordinate>;

	constructor(coordinates:Array<Coordinate>)
	{
		// Coordinate[]
		this.coordinates = coordinates;
	}

	AddCoordinate(coordinate:Coordinate) 
	{
		if (this.GetCoordinate(coordinate.id) != undefined)
		{
			return false; // cannot have duplicates
		}

		this.coordinates.push(coordinate);
		return true;
	}

	GetCoordinate(coordinate_id:string) // string identifier
	{
		return this.coordinates.find(x => x.id == coordinate_id);
	}

	ModifyCoordinate(coordinate:Coordinate)
	{
		let existing_coordinate = this.GetCoordinate(coordinate.id);

		if (existing_coordinate == undefined)
		{
			return false;
		}

		let idx = this.coordinates.indexOf(existing_coordinate);
		this.coordinates[idx] = coordinate;

		return true;
	}

	Display(): string[]
	{
		return this.coordinates.map(x => `Description: ${x.id}, X: ${x.x} Y: ${x.y} Z: ${x.z} Dimension: ${x.dimension}`);
	}
}

class Coordinate 
{
	id: string;
	x: number;
	y: number;
	z: number;
	dimension: string;

	constructor(id: string, x: number, y: number, z: number, dimension: string) 
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.dimension = dimension;
	}
}

const coordinate_store = new CoordinateStore([]);

function GetUsernames(response: ServerStatus)
{
	if (response.status.players.online ==  0 || response.status.players.sample == undefined)
	{
		return [];
	}
	return response.status.players.sample.map(x => x.name)
}

async function ServerInfoCommand() : Promise<Discord.InteractionReplyOptions>
{
	var embed = new Discord.EmbedBuilder()
		.setTitle("Cozy Cosmos Survival Server")
		.setColor(colors.purple)
		.addFields([
			{
				"name": `Server Details`,
				"value": `\`${MCServerIP}\``
			}]);
	try 
	{
		var response: ServerStatus = await mc.lookup({host: MCServerIP, port: MCServerPort, timeout: 1000});
		if (response.status.players.online > 0)
		{
			embed.addFields({
				"name": `[${response.status.players.online}/${response.status.players.max}] Players`,
				"value": `\`\`\`\n${GetUsernames(response).join("\n")}\n\`\`\``
			});
		}
		else 
		{
			embed.setFooter({ text: `[${response.status.players.online}/${response.status.players.max}] Players :(`});
		}
	}
	catch 
	{
		embed.setDescription("The minecraft server is not available right now.\nContact a moderator for assistance.")
			.setColor(colors.red);
	}

	return { embeds: [embed], ephemeral: true };
}

async function CoordinatesCommand() : Promise<Discord.InteractionReplyOptions>
{
    var coordinates = coordinate_store.Display().join('\n')
    if (coordinates == '')
    {
        coordinates = "Empty...";
    }

	var embed = new Discord.EmbedBuilder()
		.setTitle("Minecraft Server Coordinate Repository")
		.setDescription(coordinates);

	return { embeds: [embed], ephemeral: true };
}

async function CoordinatesRecordCommand(interaction: ChatInputCommandInteraction) : Promise<Discord.InteractionReplyOptions>
{
	var id: string = interaction.options.getString(COORDINATE_DESCRIPTION)
	var x: number = interaction.options.getInteger(COORDINATE_X);
	var y: number = interaction.options.getInteger(COORDINATE_Y);
	var z: number = interaction.options.getInteger(COORDINATE_Z);
	var dimension: string = interaction.options.getString(COORDINATE_DIMENSION);

	coordinate_store.AddCoordinate(new Coordinate(id, x, y, z, dimension));

	var embed = new Discord.EmbedBuilder()
		.setTitle("Created a coordinate :)")
		.setDescription(`id: ${id}, x: ${x}, y: ${y}, z: ${z}, dimension: ${dimension}`);
	return { embeds: [embed], ephemeral: true };
}

async function CoordinatesModifyCommand(interaction: ChatInputCommandInteraction ) : Promise<Discord.InteractionReplyOptions>
{
	var id: string = interaction.options.getString(COORDINATE_DESCRIPTION)
	var x: number = interaction.options.getInteger(COORDINATE_X);
	var y: number = interaction.options.getInteger(COORDINATE_Y);
	var z: number = interaction.options.getInteger(COORDINATE_Z);
	var dimension: string = interaction.options.getString(COORDINATE_DIMENSION);

	coordinate_store.ModifyCoordinate(new Coordinate(id, x, y, z, dimension));

	var embed = new Discord.EmbedBuilder()
		.setTitle("Modified a coordinate :)")
		.setDescription(`id: ${id}, x: ${x}, y: ${y}, z: ${z}, dimension: ${dimension}`);
	return { embeds: [embed], ephemeral: true };
}

async function GetReply(interaction: ChatInputCommandInteraction) : Promise<Discord.InteractionReplyOptions>
{
	switch(interaction.options.getSubcommand())
	{
		case COMMAND_SERVER:
			return ServerInfoCommand();
		case COMMAND_COORDINATES:
			return CoordinatesCommand();
		case COMMAND_RECORDCOORDINATE:
			return CoordinatesRecordCommand(interaction);
		case COMMAND_MODIFYCOORDINATE:
			return CoordinatesModifyCommand(interaction);
		default:
			return { embeds:[new Discord.EmbedBuilder().setTitle("Oops, your request could not be processed...")], ephemeral:true };
	}
}

function AddCoordinateOptions(cmd: SlashCommandSubcommandBuilder)
{
	return cmd.addStringOption(option => option
		.setName(COORDINATE_DESCRIPTION)
		.setDescription("Unique coordinate identifier")
		.setRequired(true))
	.addIntegerOption(option => option
		.setName(COORDINATE_X)
		.setDescription("X Coordinate (1st position in minecraft)")
		.setRequired(true))
	.addIntegerOption(option => option
		.setName(COORDINATE_Z)
		.setDescription("Z Coordinate (3rd position in minecraft)")
		.setRequired(true))
	.addIntegerOption(option => option
		.setName(COORDINATE_Y)
		.setDescription("Y Coordinate (2nd position in minecraft")
		.setRequired(false))
	.addStringOption(option => option
		.setName(COORDINATE_DIMENSION)
		.setDescription("Dimension")
		.setChoices({ name:"Overworld", value:'overworld' }, { name:"Nether", value: "nether" }, { name:"End", value:"end" })
		.setRequired(false))
}

const builder = new SlashCommandBuilder()
		.setName("mcinfo")
		.setDescription("Gets information about the minecraft server.")
		.addSubcommand(cmd => cmd
			.setName(COMMAND_SERVER)
			.setDescription("Gets server information"))

		.addSubcommand(cmd => cmd
			.setName(COMMAND_COORDINATES)
			.setDescription("Gets coordinate information"))

		.addSubcommand(cmd => AddCoordinateOptions(cmd)
			.setName(COMMAND_RECORDCOORDINATE)
			.setDescription("Adds a new coordinate to the coordinate repository"))

		.addSubcommand(cmd => AddCoordinateOptions(cmd
			.setName(COMMAND_MODIFYCOORDINATE)
			.setDescription("Modifies an existing coordinate in the coordinate repository.")));

async function execute(client: Client, interaction: ChatInputCommandInteraction) 
{
	var reply = await GetReply(interaction);
	interaction.reply(reply);
};

export default new ApplicationCommand(builder, execute);
