import play from 'play-dl';
import chalk from 'chalk';
import ServiceClient from '../../ServiceClient.js';
import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerState, AudioPlayerStatus, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  let channel = interaction.options.getChannel<ChannelType.GuildVoice>('voice_channel');
  let connection = joinVoiceChannel({ guildId: interaction.guildId, channelId: channel.id, adapterCreator: interaction.guild.voiceAdapterCreator });
  interaction.deferReply().then(_ => interaction.deleteReply());
  // interaction.reply({ content: 'Successfully joined VC. Rickrolling! :)', ephemeral: true });
  console.log(chalk.green(`Successfully connected to channel ${chalk.yellow(channel.name)}.`));
  let stream = await play.stream("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  let audio_resource = createAudioResource(stream.stream, { inputType: stream.type });
  let audio_player = createAudioPlayer();
  connection.subscribe(audio_player);
  audio_player.play(audio_resource);
  audio_player.on(AudioPlayerStatus.Idle, destroyVC.bind(null, connection));
}

function destroyVC(connection: VoiceConnection): void
{
  connection.destroy();
}

const builder = new SlashCommandBuilder()
  .setName('rickroll')
  .setDescription('rickrolls the given audio channel')
  .addChannelOption(opt => opt
    .setName('voice_channel')
    .setDescription('input the voice channel for imposterbot to join')
    .addChannelTypes(ChannelType.GuildVoice)
    .setRequired(true));

export default new ApplicationCommand(builder, execute);