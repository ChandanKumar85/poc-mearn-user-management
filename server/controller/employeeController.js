const Employee = require('../models/Employee');

// Show the list of employee
const index = (req, res, next) => {
  Employee.find()
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: 'An error Occured',
      });
    });
};

// Show single employee
const show = (req, res, next) => {
  let employeeId = req.body.employeeId;
  Employee.findById(employeeId)
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: 'An error Orccured!',
      });
    });
};

// add new employee
const store = (req, res, next) => {
  let employee = new Employee({
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  });
  if (req.file) employee.avatar = req.file.path;
  //   if (req.files) {
  //     let path = "";
  //     req.files.forEach((files, index, arr) => {
  //       path = path + files.path + ",";
  //     });
  //     path = path.substring(0, path.lastIndexOf(","));
  //     employee.avatar = path;
  //   }
  employee
    .save()
    .then((response) => {
      res.json({
        message: 'Employee Added Successfully!',
      });
    })
    .catch((error) => {
      res.json({
        message: 'An error Orccured!',
      });
    });
};

// update an employee
const update = (req, res, next) => {
  let employeeId = req.body.employeeId;

  let updateData = {
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  };

  Employee.findByIdAndUpdate(employeeId, { $set: updateData })
    .then(() => {
      res.json({
        message: 'Employee Updated Successfully!',
      });
    })
    .catch((error) => {
      res.json({
        message: 'An error Orccured!',
      });
    });
};

// Delete an employee
const destroy = (req, res, next) => {
  let employeeId = req.body.employeeId;
  Employee.findByIdAndDelete(employeeId)
    .then(() => {
      res.json({
        message: 'Employee Deleted Successfully!',
      });
    })
    .catch((error) => {
      res.json({
        message: 'An error Orccured!',
      });
    });
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
