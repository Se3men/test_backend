const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const path = require('path');
const { User } = require('../models/models');

const generateJwt = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' },
    )
};

class UserController {
    async register(req, res, next) {
        try {
            const { firstName, email, password } = req.body;

            if (!firstName || !email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }

            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const registrationDate = Date.now().toString()
            const user = await User.create({ firstName, email, password: hashPassword, registrationDate });
            const token = generateJwt(user.id, user.email);
            return res.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'));
            }

            let comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(ApiError.internal('Указан некорректный пароль'));
            }

            const token = generateJwt(user.id, user.email);
            return res.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message))

        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.internal('Пользователь не найден'));
            }
            const user = await User.findByPk(id);
            res.json(user)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAllUsers(req, res, next) {
        try {
            let { page, limit } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit
            const users = await User.findAndCountAll({
                order: [
                    ['registrationDate', 'ASC']
                ],
                limit, offset,
            });
            res.json(users)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.body;
            const { photo } = req.files;

            if (!id) {
                return next(ApiError.internal('Пользователь не найден'));
            }

            let fileName = `${uuid.v4()}.png`;
            photo.mv(path.resolve(__dirname, '..', 'static', fileName));

            const updatedUser = await User.update(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    sex: user.sex,
                    photo: fileName,
                },
                { where: { id } },
            )
            res.json(updatedUser);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.internal('Пользователь не найден'));
            }

            deletedUser = await User.destroy({ where: { id } })
            res.json(deletedUser);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email)
            return res.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new UserController();