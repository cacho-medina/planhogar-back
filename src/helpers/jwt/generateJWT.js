import jwt from "jsonwebtoken";

const generarJWT = async (uid, username) => {
    try {
        const payload = { uid, username };
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "3h",
        });
        return token;
    } catch (error) {
        console.error("Error al generar el token:", error.message);
        throw new Error("No se pudo generar el token");
    }
};
export default generarJWT;
