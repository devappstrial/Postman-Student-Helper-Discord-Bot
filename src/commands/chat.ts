import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config();

export = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('chatGPT - Chat with GPT-3')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('Chat with GPT-3, can only generate 60 word responses')
        .setRequired(true)
    ),

  async execute(interaction: any) {

    await interaction.reply("Generating response...");

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: interaction.options.getString('prompt'),
      temperature: 0.7,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });

    console.log(response.data)

    

    const msg = new EmbedBuilder()
      .setColor('#c7651a')
      .setTitle('ChatGPT')
      .setDescription(
          response.data.choices[0].text!.toString()
      )
      .addFields(
        {
          name: 'Prompt: '+ interaction.options.getString('prompt'),
          value: "This was generated by Davinci GPT-3"
        },
        {
          name: "Incase of Inappropriate response",
          value: "Due to the bot using free tier of OpenAI API and on testing, the bot can generate 60 word responses."
        }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [msg] });
    
  },
};
