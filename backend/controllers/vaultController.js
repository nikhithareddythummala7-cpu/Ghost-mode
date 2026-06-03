const fs = require('fs');
const MemoryVault = require('../models/MemoryVault');
const { getImageKitClient } = require('../config/imagekit');

const uploadToImageKit = async (filePath, originalName) => {
  const imagekit = getImageKitClient();

  const uploadResponse = await imagekit.files.upload({
    file: fs.createReadStream(filePath),
    fileName: originalName || 'ghostmode-upload',
    folder: 'ghostmode/vault',
    useUniqueFileName: true,
  });

  return uploadResponse.url;
};

exports.getVault = async (req, res) => {
  const items = await MemoryVault.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

exports.createVaultItem = async (req, res) => {
  const { title, description, fileType } = req.body;
  if (!title || !fileType) {
    return res.status(400).json({ message: 'Title and file type are required' });
  }
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'File upload is required' });
  }

  const filePath = req.file.path;

  try {
    const fileUrl = await uploadToImageKit(filePath, req.file.originalname);
    const vaultItem = await MemoryVault.create({
      userId: req.user._id,
      fileUrl,
      fileType,
      title,
      description: description || '',
      fileSize: req.file.size || 0
    });

    res.status(201).json(vaultItem);
  } catch (error) {
    console.error('ImageKit upload failed:', error.message || error);
    res.status(500).json({ message: 'Image upload failed', error: error.message || 'Unknown upload error' });
  } finally {
    await fs.promises.unlink(filePath).catch(() => {});
  }
};

exports.deleteVaultItem = async (req, res) => {
  const item = await MemoryVault.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!item) {
    return res.status(404).json({ message: 'Vault item not found' });
  }
  res.json({ message: 'Vault item removed' });
};
