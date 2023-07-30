require('dotenv').config();
const amqp = require('amqplib');
const NotesServices = require('./NotesServices');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const notesService = new NotesServices();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:notes', {
    durable: true,
  });

  channel.consume('export:notes', listener.listen, { noAck: true });
};

init();
