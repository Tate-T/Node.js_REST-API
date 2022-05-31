const { Contacts } = require("./mongooseModel");

const listContacts = async () => {
  return await Contacts.find({});
}

const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
}

const removeContact = async (contactId) => {
  return await Contacts.findByIdAndRemove(contactId);
}

const addContact = async ({ name, email, phone, favorite }) => {
  const newContact = { name, email, phone, favorite };
  const newContacts = await new Contacts(newContact);
  await newContacts.save();
  return newContacts;
}

const updateContact = async (contactId, body) => {
  await Contacts.findByIdAndUpdate(contactId, {
    $set: body,
  });
  return getContactById(contactId);
}

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  await Contacts.findByIdAndUpdate(contactId, {
    $set: { favorite },
  });
  return getContactById(contactId);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
