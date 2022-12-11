// models
const { user } = require('../../models');

// package
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register
exports.register = async (req, res) => {
  try {
    // get input data
    const data = req.body;

    // validate
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
      password: Joi.string().min(5).required(),
      role: Joi.number().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        status: 'Error',
        message: error.details[0].message,
      });
    }

    // check email user exist
    const checkEmailExist = await user.findOne({
      where: { email: data.email },
    });

    if (checkEmailExist) {
      return res.status(400).send({
        status: 'Error',
        message: 'Email has been registered',
      });
    }

    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // create new user data
    const newData = await user.create({
      ...data,
      password: hashedPassword,
      status: 0,
    });

    // get new data user from database
    const dataUser = await user.findOne({
      where: {
        id: newData.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User registration was successful',
      data: dataUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get input data
    const data = req.body;

    // validate
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
      password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        status: 'Error',
        message: error.details[0].message,
      });
    }

    // check user email and password is correct
    const checkUser = await user.findOne({
      where: { email: data.email },
    });

    const passwordValid = await bcrypt.compare(data.password, checkUser.password);

    if (checkUser === null || !passwordValid) {
      return res.status(400).send({
        status: 'Error',
        message: 'Invalid email or password',
      });
    }

    // generate token
    const token = jwt.sign({ id: checkUser.email, role: checkUser.role }, process.env.TOKEN_KEY);

    // data user
    const dataUser = {
      id: checkUser.id,
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
      token,
    };

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Login successful',
      data: dataUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// check auth
exports.checkAuth = async (req, res) => {
  try {
    // get id user
    const id = req.user.id;

    // get data user
    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    });

    if (!dataUser) {
      return res.status(400).send({
        status: 'Error',
        message: 'User not found',
      });
    }

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Login successful',
      data: dataUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};
