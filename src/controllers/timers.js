export const createTimerController = async (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: 200,
    message: 'Already obtain body!',
    data: req.body,
  });
};
