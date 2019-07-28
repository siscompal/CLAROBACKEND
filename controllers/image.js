'use strict'
// MODULOS
const Imagen = require('../models/image');
const path = require('path');
const fs = require('fs-extra');
const { unlink } = require('fs-extra');



function uploadImage(req, res) {

    let fileName = 'Imagen no subida...';
    let imagen = new Imagen;
    console.log(req.files);
    if(req.files){

        var filePath = req.files.image.path;
	console.log(filePath);       
 	var fileSplit = filePath.split('/');
	console.log(fileSplit);
        fileName = fileSplit[1];
	console.log(fileName);
        var extSplit = fileName.split('.');
        var fileExt = extSplit[1].toLowerCase();
        imagen.imagePath = fileName;
        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){

            imagen.save((err, uploaded) => {
                if(err) return res.status(500).send({message: 'La imagen no se ha subido'});

                if(!uploaded) return res.status(404).send({message: 'No se ha guardado la imagen'});

                return res.status(200).send({
                    imagen: uploaded
                });
            });

        }else{
            fs.unlink(filePath, (err) => {
                return res.status(500).send({message: 'La extensión no es válida'});
            });
        }

    }else{
        return res.status(500).send({
            message: fileName
        });
    }
}

function getImageFile(req, res){
    var file = req.params.image;
	var path_file = './uploads/'+file;
    fs.exists(path_file, (exists) => {
        if(exists){
            return res.sendFile(path.resolve(`${__dirname}/../${path_file}`));
        }else{
            return res.status(404).send({
                message: "No existe la imagen..."
            });
        }
    });
}


async function deleteImage(req, res) {
    const image = await Imagen.findByIdAndDelete(req.params.id);
    await unlink(path.resolve(`${__dirname}/../uploads/${image.imagePath}`));
    res.status(200).send({
        message: "Imagen eliminida"
    });
}


function getImages(req, res) {
    Imagen.find({}).exec((err, images) => {
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
    getImages,
    getImageFile
};
