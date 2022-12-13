// models
const { user } = require('../../models');

// package
const bcrypt = require('bcrypt');

// get users
exports.getUsers = async (req, res) => {
  try {
    // get data users
    let dataUsers = await user.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // check data
    if (!dataUsers) {
      return res.status(200).send({
        status: 'Success',
        message: 'User data not found',
      });
    }

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data found',
      data: dataUsers,
    });
  } catch (error) {
    res.status(500).send({
      error: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get user
exports.getUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // get data users
    let dataUsers = await user.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // check data
    if (!dataUsers) {
      return res.status(200).send({
        status: 'Success',
        message: 'User data not found',
      });
    }

    dataUsers = JSON.parse(JSON.stringify(dataUsers));

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data found',
      data: dataUsers,
    });
  } catch (error) {
    res.status(500).send({
      error: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // get input data
    const data = req.body;

    // check input password
    if (data.password) {
      // hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // update data
      await user.update({ ...data, password: hashedPassword }, { where: { id } });
    } else {
      // update data
      await user.update(data, { where: { id } });
    }

    // get user data
    const dataExist = await user.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data updated successfully',
      data: dataExist,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // delete user
    await user.destroy({
      where: {
        id,
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};
