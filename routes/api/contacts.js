const express = require('express');

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  // removeContact,
  // updateContact,
} = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  const contacts = await listContacts();
  return res.status(200).json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
  try {
    return res.status(200).json(await getContactById(req.params.contactId))
  }
  catch {
    return res.status(404).json({ message: 'Not found' })
  }
})

router.post('/', async (req, res, next) => {
  try {
    return res.status(201).json(await addContact(req.body))
  } catch {
    return res.status(400).json({ message: 'missing required name field' })
  }

})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
