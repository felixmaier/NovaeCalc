/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Database class
   * Database helper
   * @param {object} mongodb
   */
  function Database(mongo) {

    this.mongodb = mongo;

    this.dbClient = null;

    this.rooms = null;

    this.instance = null;

    this.ready = false;

  };

  /**
   * Initialize the database
   * @param {object} mongo server
   * @method init
   */
  Database.prototype.init = function(server, resolve) {

    /** Async visibility fix */
    var self = this;

    /** Initialize database */
    this.instance = new this.mongodb.Db('novaecalc', server, {});

    var instance = this.instance;

    /** Open database */
    instance.open(function (error, client) {

      if (error) throw error;

      self.dbclient = client;

      self.dbclient.createCollection('rooms', function(){
        self.rooms = new self.mongodb.Collection(self.dbclient, 'rooms');
        self.rooms.ensureIndex({name: 1}, {unique:true}, function(){});
        self.rooms.ensureIndex({cells: 1}, {unique:false}, function(){});

        self.rooms.count(function(err, count) {
          console.log('Registered rooms: '+count);
        });

        resolve(1);

      });

      /** In ready state */
      self.ready = true;

    }, {strict:true});

  };

  /**
   * Insert into the database
   * @param {string} collection name
   * @param {object} data
   * @param {number} callback
   * @method insertCollection
   */
  Database.prototype.insertCollection = function(collection, data, resolve) {

    /** Async visibility fix */
    var self = this;

    /** Database in ready state */
    if (this.ready && this[collection] && data) {

      if (this[collection] !== undefined && this[collection] !== null) {
        /** Check if already exists */
        this[collection].find(data, {limit: 1}).count(function(error, count) {
          if (error) {
            console.warn(err.message);
            resolve(0);
            return void 0;
          }
          /** Already exists */
          if (count > 0) {
            resolve(0);
            return void 0;
          } else {
            /** Insert */
            data.cells = {};
            self[collection].insert(data, {safe: true}, function(error, objects) {
              /** Error */
              if (error) {
                console.log(error.err);
                resolve(0);
              }
              /** Success */
              else resolve(1);
            });
          }
        });
      } else resolve(0);

    } else resolve(0);

  };

  /**
   * Get from the database
   * @param {string} collection name
   * @param {object} data
   * @param {number} callback
   * @method getCollection
   */
  Database.prototype.getCollection = function(collection, data, resolve) {

    /** Async visibility fix */
    var self = this;

    var result = null;

    /** Database in ready state */
    if (this.ready && this[collection] && data) {

      if (this[collection] !== undefined && this[collection] !== null) {

        this[collection].find(data, {limit: 1}).count(function(error, count) {
          if (error) {
            console.warn(err.message);
            resolve(0);
            return void 0;
          }
          /** Exists */
          if (count > 0) {
            self[collection].findOne(data, function(error, object) {
              result = object;
              /** Don't pass over the id */
              if (result["_id"]) delete result["_id"];
              resolve({data: result});
            });
          } else resolve(0);
        });

      }

    }

  };

  module.exports = Database;