const express = require('express');

const router = express.Router();

const { validation } = require('../../middlevares/validation');

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
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

router.post('/', validation, async (req, res, next) => {
  try {
    return res.status(201).json(await addContact(req.body))
  } catch {
    return res.status(400).json({ message: 'missing required name field' })
  }

})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const response = await removeContact(req.params.contactId);
    return res.status(200).json({ "message": "contact deleted" })
  } catch {
    return res.status(404).json({ message: 'Not found' })
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    return res.status(200).json(await updateContact(req.params.contactId, req.body))
  }
  catch {
    return res.status(404).json({ "message": "Not found" })
  }
})

module.exports = router
