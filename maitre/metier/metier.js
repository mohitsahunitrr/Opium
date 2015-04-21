var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');
var noyau_metier = require('./local_modules/noyau_metier');

// Chemin vers le répertoire des données
var repertoire_donnees = json.repertoire_donnees;

// Chemin vers le répertoire de micmac
var repertoire_micmac = json.repertoire_micmac;

// Récupérer le port d'écoute depuis ../config.json
var listen_port = parseInt(json.metier);
var notif_port = parseInt(json.MMManager_metier);

console.log(listen_port);

var server = messenger.createListener(listen_port);
var client = messenger.createSpeaker(notif_port);

var Besoin;
console.log('avant la notif');
server.on('notification',function(message, data){
  console.log('notif recue');
  // Calcul des points de liaison + mise en place + calibration + AperiCloud
  model.besoins.find({ etat: '2' }, function(err, besoin) {
    if (err) throw err;
    console.log('notification reçue');
    for(var i=0; i<besoin.length; i++){
      model.besoins.findByIdAndUpdate(besoin[i]._id, { etat: '4' }, function(err, besoin) {
        if (err) throw err;

        // we have the updated user returned to us
        console.log(besoin);
        });
      Besoin = new model.besoins(besoin[i]);
      noyau_metier.besoin2jobs(Besoin);
    }
  });
  // Apperiement dense
  model.besoins.find({etat:'8'}, function(err, besoin){
    if(err) console.log('erreur: recherche dans la BD des elements avec etat=8');

  });

});
