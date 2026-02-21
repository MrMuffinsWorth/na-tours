module.exports = fn => {
  return (req, res, next) => { // express must have a function with these arguments to wait until the route is hit to execute
    fn(req, res, next).catch(err => next(err));
  }
};
