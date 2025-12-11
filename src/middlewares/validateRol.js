import { Roles } from '../database/hormiwatch/roles.js';
const TOKEN_SECRET = process.env.TOKEN_SECRET;
import jwt from "jsonwebtoken";

export const rolRequired = (rol, rol2, rol3) => async (req, res, next) => {
    //obtiene el usuario del request
    const { authToken } = req.cookies;
    //si no hay usuario lanza un error
    if (!authToken) return res.status(401).json({ message: "No hay Token, autorizacion denegada" });
    //se verifica el token
    jwt.verify(authToken, TOKEN_SECRET, async (err, user) => {

        //verificca si hay un error en el token
        if (err) return res.status(403).json({ message: "Invalid Token" });
        //busca el rol del usuario
        const userRol = await Roles.findOne({ where: { id_rol: user.id_rol } });
        //si no encuentra el rol lanza un error
        if (!userRol) return res.status(403).json({ message: "Rol no encontrado" });

        //verifica si el usuario tiene el rol correccto
        if (rol !== userRol.nombre_rol && rol2 !== userRol.nombre_rol && rol3 !== userRol.nombre_rol) return res.status(403).json({ message: "No tienes los permisos para acceder aquí" });

        req.user = user

        next()
    })

}
