import Usuario from "../database/models/Usuario.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Usuario.findOne({ where: { username } });
        if (!user) {
            return res
                .status(400)
                .json({ message: "username* o password incorrecto" });
        }
        const userPassword = bcrypt.compareSync(password, user.password);
        if (!userPassword) {
            return res
                .status(400)
                .json({ message: "username o password incorrecto*" });
        }
        if (!user.activo) {
            return res.status(400).json({ message: "Usuario suspendido" });
        }
        res.status(200).json({
            message: "El usuario ingreso correctamente!",
            email: user.email,
            username: user.username,
            id: user._id,
            esAdmin: user.esAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al comprobar credenciales del usuario",
        });
    }
};
/* export const signUp = (req, res) => {
    try {
    } catch (error) {
        console.error(error);
        return error;
    }
}; */
/* export const logout = (req, res) => {}; */
export const getUsers = async (req, res) => {
    try {
        const userList = await Usuario.findAll();
        res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            mensaje: "No se pudo obtener la lista de Usuarios",
        });
    }
};
export const postUser = async (req, res) => {
    try {
        const user = await Usuario.findOne({
            where: { email: req.body.email },
        });
        if (user) {
            return res
                .status(400)
                .json({ message: "El email ya esta registrado" });
        }
        const newUser = await Usuario.build(req.body);
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(req.body.password, salt);
        await newUser.save();
        res.status(201).json({ message: "Usuario creado con exito" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "No se pudo crear el usuario" });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "El usuario no fue encontrado" });
        }

        const userDeleted = await user.destroy();
        res.status(200).json({ message: "Usuario eliminado con exito" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al encontrar el usuario" });
    }
};
/* export const putUser = (req, res) => {
    try {
    } catch (error) {
        console.error(error);
        return error;
    }
}; */
/* export const protectedRoute = (req, res) => {}; */
