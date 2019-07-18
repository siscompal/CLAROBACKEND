'use strict'
// MODULOS
const Imagen = require('../models/image');
const path = require('path');
const fs = require('fs-extra');
const { unlink } = require('fs-extra');


function randomName() {
    const possible = 'abcdefghijkmnopqrstuvwxyz0123456789';
    let random = '';
    for (let i = 0; i < 6; i++) {
        random += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return random;
}

async function uploadImage(req, res) {
    const imagen = new Imagen();
    const imageName = randomName();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const imagePath = req.file.path;
    const target = path.resolve(`${__dirname}/../public/uploads/${imageName}${ext}`);

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        await fs.rename(imagePath, target);
        imagen.imagePath = target;
        imagen.save((err, imageSaved) => {
            if (err) {
                res.status(500).send({ message: 'Error en el servidor' });
            } else {
                if (!imageSaved) {
                    res.status(404).send({ message: 'No se ha guardado la imagen' });
                } else {
                    res.status(200).send({ message: 'Imagen cargada correctamente' });

                }
            }
        })

    } else {
        res.status(500).send({
            message: 'Verifique la extensión de la imagen'
        });
    }

}

async function deleteImage(req, res) {
    const image = await Imagen.findByIdAndDelete(req.params.id);
    await unlink(path.resolve(image.imagePath));
    res.status(200).send({
        message: "Imagen eliminida"
    });
}


function getImages(req, res) {
    Imagen.find({}).exec((err, images) => {
        // .populate('usuario', 'nombre apellidos') para solo devolver los campos que quiero.
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!images) {
                res.status(404).send({ message: 'No hay imagenes' });
            } else {
                res.status(200).send({ images });
            }
        }
    });
}

module.exports = {
    uploadImage,
    deleteImage,
    getImages
};