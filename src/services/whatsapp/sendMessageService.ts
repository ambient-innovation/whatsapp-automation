import express from "express";
import {Client} from "whatsapp-web.js";
import CronTaskService from "../cronTaskService";

export default class SendMessageService {
  private app: express.Application;
  private readonly client?: Client;

  private readonly person: string;
  private readonly time: string;
  private readonly text: string;

  constructor({app, person, time, text}: { app: express.Application, person: string, time: string, text: string }) {
    this.app = app
    this.client = app.locals.whatsAppClient

    this.person = person
    this.time = time
    this.text = text

  }

  public async sendMessage() {
    if (!this.client) return

    const chats = await this.client.getChats()
    // const contacts = client.getContacts()

    // const chatNames = chats.map(chat => chat.name)
    // console.log(chatNames)

    const filteredChats = chats.filter(chat => chat.name.toLowerCase().includes(this.person.toLowerCase()))
    const desiredChat = filteredChats[0]

    if (!desiredChat) return

    const service = new CronTaskService({
      chatObject: desiredChat,
      message: this.text,
      dateString: this.time
    })
    await service.scheduleMessage()
  }
}