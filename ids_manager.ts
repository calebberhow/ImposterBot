import { PathLike } from 'fs';
import { FileHandle, readFile } from 'fs/promises';

async function readJSON(filePath: PathLike | FileHandle) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

var USAGE = 'cozy'; // "cozy" or "test"
var IDs: { [x: string]: string; prefix: string; cozycosmos: string; activegamesChannelID: string; lobbypingsRoleID: string; managerChannelID: string; mutedRoleID: string; managerRoleID: string; serverID: string; oxygen: string; otherpartygamesRoleID: string; health: string; sword: string; shield: string; ability: string; announcementChannelID: string; cressyID: string; doggothinkID: string; doggoheartID: string; auditLogChannelID: string; developerChannelID: string; reactor: string; reportEmoteID: string; cyaEmoteID: string; painEmoteID: string; khazaariID: string; welcomeChannelID: string; helloEmoteID: string; adminRoleID?: string; memberRoleID?: string; minecraftEmoteID?: string; hearts?: string; spades?: string; clubs?: string; diamonds?: string; _AceR?: string; _AceB?: string; _QueenR?: string; _QueenB?: string; _KingR?: string; _KingB?: string; _JackR?: string; _JackB?: string; _2R?: string; _2B?: string; _3R?: string; _3B?: string; _4R?: string; _4B?: string; _5R?: string; _5B?: string; _6R?: string; _6B?: string; _7R?: string; _7B?: string; _8R?: string; _8B?: string; _9R?: string; _9B?: string; _10R?: string; _10B?: string; blankTop?: string; blankBottom?: string; coinEmoji?: string; cakeEmoji?: string; chickenEmoji?: string; dragonEmoji?: string; rainbowHeartEmoji?: string; crewmateEmoji?: string; tosEmoji?: string; cosmosEmoji?: string; diamondEmoji?: string; ambushEmoji?: string; redsus?: string; };
if (USAGE == 'test')
{
  IDs = await readJSON('./ids_test.json'); 
}
else
{
  IDs = await readJSON('./ids_cozy.json'); 
}

export default IDs;

export { IDs, USAGE };
