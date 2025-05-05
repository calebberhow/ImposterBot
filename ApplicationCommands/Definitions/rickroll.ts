import play from 'play-dl';
import chalk from 'chalk';
import ServiceClient from '../../ServiceClient.js';
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  switch (interaction.options.getSubcommand())
  {
    case 'start':
      return start(client, interaction);
    case 'stop':
      return stop(client, interaction);
    default:
      return;
  }
}

async function stop(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
  if (client.Services.EventAggregator.HasListener(GetEvent(interaction.guildId)))
  {
    client.Services.EventAggregator.Invoke(GetEvent(interaction.guildId), interaction);
    return;
  }

  await interaction.reply({ content: "Not currently playing... :/" });
}

async function start(client: ServiceClient, interaction: ChatInputCommandInteraction)
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

  let id = client.Services.EventAggregator.Subscribe(GetEvent(interaction.guildId), async (event) =>
  {
    connection.destroy();
    let newInteraction = event as ChatInputCommandInteraction;
    await newInteraction.deferReply();
    await newInteraction.deleteReply();
    client.Services.EventAggregator.Unsubcribe(id);
  });

  audio_player.on(AudioPlayerStatus.Idle, () =>
  {
    connection.destroy();
    client.Services.EventAggregator.Unsubcribe(id);
  });
}

function GetEvent(guild_id: string)
{
  return `rickroll_stop_${guild_id}`;
}

const builder = new SlashCommandBuilder()
  .setName('rickroll')
  .setDescription('starts/stops rickroll.')
  .addSubcommand(cmd => cmd
    .setName('start')
    .setDescription('starts rickroll on the given channel.')
    .addChannelOption(opt => opt
      .setName('voice_channel')
      .setDescription('input the voice channel for imposterbot to join')
      .addChannelTypes(ChannelType.GuildVoice)
      .setRequired(true)))
  .addSubcommand(cmd => cmd
    .setName('stop')
    .setDescription('stops ImposterBot from rickrolling.'))
  .setDefaultMemberPermissions(PermissionFlagsBits.Speak | PermissionFlagsBits.Connect);

export default new ApplicationCommand(builder, execute);