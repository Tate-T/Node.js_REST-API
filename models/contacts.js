const fs = require('fs/promises');

const path = require("path");

const uniqid = require("uniqid");

const Joi = require('joi');

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  JSON.parse(await fs.readFile(contactsPath, "utf-8"));

}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  if (contacts.length === newContacts.length) return false;
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts
}

const addContact = async ({ name, email, phone }) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().required(),
    phone: Joi.number(),
  });
  const contacts = await listContacts();
  const validationResult = schema.validate({ name, email, phone });
  if (validationResult.error) return false;
  const newContact = { id: uniqid(), name, email, phone };
  const newContacts = [...contacts, newContact]
  fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const postIndex = contacts.findIndex((item) => contactId === item.id);
  const newContact = {
    ...contacts[postIndex],
    ...body,
    id: contacts[postIndex].id,
  };
  contacts.splice(postIndex, 1, newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
