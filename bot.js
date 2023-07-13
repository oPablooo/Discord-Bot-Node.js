const Discord = require('discord.js');
const client = new Discord.Client();
const channelId = 'channel_ID'; // Replace with the actual channel ID

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Bot is ready!');
});

client.on('message', async (message) => {
  if (message.content === '!hello' && message.channel.id === channelId) {
    const helloEmbed = new Discord.MessageEmbed()
      .setTitle('Hello!')
      .setDescription('I am your Discord bot!')
      .setColor('#00ff00');
    message.channel.send(helloEmbed);
  }

  if (message.content === '!create_character' && message.channel.id === channelId) {
    const characterCreationEmbed = new Discord.MessageEmbed()
      .setTitle('Character Creation')
      .setDescription('Let\'s create a character! Please answer the following questions:')
      .setColor('#00ff00');
    message.channel.send(characterCreationEmbed);

    const questions = [
      'Enter character name:',
      'Enter character age:',
      'Enter character race (Human, Elf, Orc, Fairy):',
      'Enter character class (Warrior, Mage, Paladin, Assassin):'
    ];
    const answers = [];

    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    let currentQuestion = 0;

    while (currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      const questionEmbed = new Discord.MessageEmbed()
        .setTitle('Question')
        .setDescription(question)
        .setColor('#00ff00');
      await message.channel.send(questionEmbed);

      try {
        const collected = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
        const response = collected.first().content.trim();

        if (currentQuestion === 0) {
          const name = response.charAt(0).toUpperCase() + response.slice(1); // Capitalize first letter
          answers.push(name);
          currentQuestion++;
        } else if (currentQuestion === 1) {
          const age = parseInt(response);
          if (isNaN(age) || age < 0 || age > 100) {
            let errorMsg = '';
            if (age < 0) {
              errorMsg = 'You must exist to join this world, choose a number between 0 and 100.';
            } else if (age > 100) {
              errorMsg = 'Too old, choose a number between 0 and 100.';
            }
            throw new Error(errorMsg);
          }
          answers.push(age);
          currentQuestion++;
        } else if (currentQuestion === 2) {
          const race = response.toLowerCase();
          if (!['human', 'elf', 'orc', 'fairy'].includes(race)) {
            throw new Error('You must choose between the races: Human, Elf, Orc, or Fairy.');
          }
          const raceCapitalized = race.charAt(0).toUpperCase() + race.slice(1); // Capitalize first letter
          answers.push(raceCapitalized);
          currentQuestion++;
        } else if (currentQuestion === 3) {
          const charClass = response.toLowerCase();
          if (!['warrior', 'mage', 'paladin', 'assassin'].includes(charClass)) {
            throw new Error('You must choose between the classes: Warrior, Mage, Paladin, or Assassin.');
          }
          const charClassCapitalized = charClass.charAt(0).toUpperCase() + charClass.slice(1); // Capitalize first letter
          answers.push(charClassCapitalized);
          currentQuestion++;
        }
      } catch (err) {
        const errorEmbed = new Discord.MessageEmbed()
          .setTitle('Character Creation Error')
          .setDescription(err.message)
          .setColor('#ff0000');
        message.channel.send(errorEmbed);
      }
    }

    const [name, age, race, charClass] = answers;
    const characterEmbed = new Discord.MessageEmbed()
      .setTitle('Character Created')
      .setDescription(`Name: ${name}\nAge: ${age}\nRace: ${race}\nClass: ${charClass}`)
      .setColor('#00ff00');
    message.channel.send(characterEmbed);
  }

  if (message.content.startsWith('!roll')) {
    const args = message.content.split(' ');
    if (args.length !== 2) {
      const errorEmbed = new Discord.MessageEmbed()
        .setTitle('Invalid Command Format')
        .setDescription('Use `!roll d20` or `!roll d6`.')
        .setColor('#ff0000');
      message.channel.send(errorEmbed);
      return;
    }
    const dice = args[1].toLowerCase();
    const [validDice, maxNumber] = validateDice(dice);
    if (!validDice) {
      const errorEmbed = new Discord.MessageEmbed()
        .setTitle('Invalid Dice Format')
        .setDescription('Use `!roll d20` or `!roll d6`.')
        .setColor('#ff0000');
      message.channel.send(errorEmbed);
      return;
    }
    const result = Math.floor(Math.random() * maxNumber) + 1;
    const rollEmbed = new Discord.MessageEmbed()
      .setTitle('Dice Roll')
      .setDescription(`You rolled a ${dice} and got ${result}!`)
      .setColor('#00ff00');
    message.channel.send(rollEmbed);
  }
});

function validateDice(dice) {
  const diceRegex = /^d([1-9]\d*)$/;
  const match = dice.match(diceRegex);
  if (match) {
    const maxNumber = parseInt(match[1]);
    return [true, maxNumber];
  }
  return [false, 0];
}

client.login('Discord_Token');
