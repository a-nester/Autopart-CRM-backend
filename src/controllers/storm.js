import { getAllGroupes } from '../services/storm.js';

export const getGroupesController = async (req, res) => {
  const groupes = await getAllGroupes(req.query);

  res.status(200).json({
    status: 200,
    message: 'Successfully get groupes',
    data: groupes,
  });
};
