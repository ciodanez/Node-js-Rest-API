import { getConnection } from "../database/database";

const getServicios = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * from tb_examen_fabricio");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * from tb_examen_fabricio WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addServicio = async (req, res) => {
    try {
        const { nombre, fecha, descripcion, tipo, precio } = req.body;
        const servicio = { nombre, fecha, descripcion, tipo, precio };
        const validaciones = await esDatosUsuario(servicio);
        if (validaciones.length > 0) {
            res.status(400);
            res.json({ "errores": validaciones });
        }
        else {
            //Hay que truncar el numero por si llegan decimales
            //se hace aqui para pasar por las validaciones
            servicio.tipo = Math.trunc(servicio.tipo);
            servicio.precio = Math.trunc(servicio.precio);
            const connection = await getConnection();
            const result = await connection.query("INSERT INTO tb_examen_fabricio SET ?", servicio);
            res.json(result);
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE from tb_examen_fabricio WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, fecha, descripcion, tipo, precio } = req.body;
        const servicio = { nombre, fecha, descripcion, tipo, precio };
        const validaciones = await esDatosUsuario(servicio);
        if (validaciones.length > 0) {
            res.status(400);
            res.json({ "errores": validaciones });
        }
        else {
            //Hay que truncar el numero por si llegan decimales
            //se hace aqui para pasar por las validaciones
            servicio.tipo = Math.trunc(servicio.tipo);
            servicio.precio = Math.trunc(servicio.precio);
            const connection = await getConnection();
            const result = await connection.query("UPDATE tb_examen_fabricio SET ? WHERE id = ?", [servicio, id]);
            res.json(result);
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const existeNombre = async (nombre) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT nombre FROM tb_examen_fabricio WHERE nombre = ?", nombre);
        return (result.length !== 0);
    } catch (error) {
        console.log(error);
    }
};

const esDatosUsuario = async (servicio) => {
    let validaciones = new Array();

    //validaciones del nombre
    if (servicio.nombre === undefined) {
        validaciones.push("Debe existir el campo nombre.");
    }
    else if (servicio.nombre === "") {
        validaciones.push("El campo nombre no puede estar vacío.");
    }
    else if (await existeNombre(servicio.nombre)) {
        console.log("LA VER" + existeNombre(servicio.nombre));
        validaciones.push("El campo nombre debe tener un valor diferente.");
    }

    //validaciones de fecha
    if (servicio.fecha === undefined) {
        validaciones.push("Debe existir el campo fecha.");
    }
    else if (servicio.fecha === "") {
        validaciones.push("El campo fecha no puede estar vacío.");
    }
    else if (!esFechaValida(servicio.fecha)) {
        validaciones.push("La fecha debe tener formato AAAA/MM/DD");
    }

    //validaciones de descripcion
    if (servicio.descripcion === undefined) {
        validaciones.push("Debe existir el campo descripcion.");
    }
    else if (servicio.fecha === "") {
        validaciones.push("El campo descripcion no puede estar vacío.");
    }

    //validaciones de tipo
    if (servicio.tipo === undefined) {
        validaciones.push("Debe existir el campo tipo.");
    }
    else if (isNaN(servicio.tipo)) {
        validaciones.push("El campo tipo debe ser un numero.");
    }
    else if (parseInt(servicio.tipo, 10) < 0) {
        validaciones.push("El campo tipo debe ser no negativo.");
    }

    //validaciones de precio
    if (servicio.precio === undefined) {
        validaciones.push("Debe existir el campo precio.");
    }
    else if (isNaN(servicio.precio)) {
        validaciones.push("El campo precio debe ser un numero.");
    }
    else if (parseInt(servicio.precio, 10) < 0) {
        validaciones.push("El campo precio debe ser no negativo.");
    }

    return validaciones;
}

const esFechaValida = (fecha) => {
    let RegExPattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (fecha.match(RegExPattern)) {
        return true;
    }
    return false;
}

export const methods = {
    getServicios,
    addServicio,
    getServicio,
    deleteServicio,
    updateServicio
};