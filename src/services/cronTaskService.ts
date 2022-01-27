import {Chat} from 'whatsapp-web.js';
import cron from 'node-cron';

const getCronExpressionFromString = (dateString: string) => {
  const dateStringArray = dateString.split(' ')
  const dateArray = dateStringArray[0].split('.')
  const day = parseInt(dateArray[0], 10)
  const month = parseInt(dateArray[1], 10)

  const timeArray = dateStringArray[1].split(':')
  const hour = parseInt(timeArray[0], 10)
  const minute = parseInt(timeArray[1], 10)

  return `${minute} ${hour} ${day} ${month} *`
}

export default class CronTaskService {
  private chatObject: Chat;
  private readonly message: string;
  private readonly dateString?: string;

  constructor({chatObject, message, dateString}: { chatObject: Chat, message: string, dateString?: string }) {
    this.chatObject = chatObject
    this.message = message
    this.dateString = dateString
  }

  public async scheduleMessage() {
    if (!this.dateString) {
      await this.chatObject.sendMessage(this.message)
      console.log(`Successfully sent '${this.message}' to ${this.chatObject.name}`);
    } else {
      console.log('Scheduling a task!')
      cron.schedule(getCronExpressionFromString(this.dateString), async () => {
        await this.chatObject.sendMessage(this.message)
        console.log(`Successfully sent '${this.message}' to ${this.chatObject.name}`);
      });
    }
  }
}