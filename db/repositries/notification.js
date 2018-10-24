import db from '../db';

const { Notification } = db.models;

const addNotification = async (payload) => {
  console.log('payload', payload);
  
  const res = await Promise.all(payload.assignedTo.map(async userId => {
    await Notification.create({
      userId,
      message: payload.message,
      read: 0 // unread
    });
  }));

  return res;
}

const updateNotification = async (userId) => {
  const res = await Notification.update({
    read: 1 // read
  }, {
    where: {
      userId
    }
  });

  return res;
}

const getNotifications = async (userId) => {
  const res = await Notification.findAll({
    attributes: ['message'],
    where: {
      userId,
      read: 0
    }
  });

  return res;
}

module.exports = {
  addNotification,
  updateNotification,
  getNotifications
}