const path = require("path");
exports.get404Page = (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
  // res.status(404).render('404');
};
exports.get500Page = (req, res, next) => {
  res.status(500).sendFile(path.join(__dirname, "..", "views", "500.html"));
};
