import { getAllGroups } from '../services/storm.js';

export const getGroupsController = async (req, res) => {
  const groupes = await getAllGroups(req.query);

  res.status(200).json({
    status: 200,
    message: 'Successfully get groupes',
    data: groupes,
  });
};
