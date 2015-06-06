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
   * Room class
   * Represents a user room
   */
  function Room(name, owner) {
    /**
     * Room name
     *
     * @member {string}
     */
    this.name = name;
    /**
     * Unique room id
     *
     * @member {number}
     */
    this.id = id;
    /**
     * Name of the owner
     *
     * @member {string}
     */
    this.owner = owner;
    /**
     * Users in this room
     *
     * @member {array}
     */
    this.users = [];
    /**
     * Max room user amount
     *
     * @member {number}
     * @default 12
     */
    this.userLimit = 12;
  };

  /**
   * Check if a user is in this room
   * @param {string} username Username
   * @method userExists
   * @return {boolean}
   */
  Room.prototype.userExists = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].username === username) return (true);
    }

    return (false);

  };

  /**
   * Check if user is the room owner
   * @param {string} username Username
   * @method isOwner
   * @return {boolean}
   */
  Room.prototype.isOwner = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].owner >= 3) return (true);
    }

    return (false);

  };

  /**
   * Adds a new user to the room
   * @param {object} user User
   * @method addUser
   */
  Room.prototype.addUser = function(user) {

    /** Validate user object */
    if (!typeof user === "object") return (false);
    if (!user.username) return (false);

    /** Check if room already exists, continue if not */
    if (!this.userExists(user.username)) {
      this.users.push(user);
    }

    return void 0;

  };

  /**
   * Removes a user from the room
   * @param {string} username Username
   * @method removeUser
   */
  Room.prototype.removeUser = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {

      if (this.users[ii] && this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) {
          this.users = this.users.slice(ii);
        }
      }

    }

    return void 0;

  };

  module.exports = Room;