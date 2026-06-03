const EmergencyContact = require('../models/EmergencyContact');

exports.getContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ userId: req.user._id });
  res.json(contacts);
};

exports.createContact = async (req, res) => {
  const { name, email, relationship } = req.body;
  if (!name || !email || !relationship) {
    return res.status(400).json({ message: 'Name, email, and relationship are required' });
  }
  const contact = await EmergencyContact.create({
    userId: req.user._id,
    name,
    email,
    relationship
  });
  res.status(201).json(contact);
};

exports.updateContact = async (req, res) => {
  const contact = await EmergencyContact.findOne({ _id: req.params.id, userId: req.user._id });
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  const { name, email, relationship } = req.body;
  if (name) contact.name = name;
  if (email) contact.email = email;
  if (relationship) contact.relationship = relationship;
  await contact.save();
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  const contact = await EmergencyContact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json({ message: 'Emergency contact removed' });
};
