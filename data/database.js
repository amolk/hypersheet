/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User extends Object {}
class SheetRow extends Object {
  findById(id) {
    console.log("SheetRow.findById " + id);
    return {
      id: 100,
      data: {
        name: 'Aria',
        age: 4
      }
    };
  }
};

SheetRow.getData = function(info) {
  var arr = [];
  for(var key in info) {
    var datum = new SheetRowDatum();
    datum.key = key;
    datum.value = info[key];
    arr.push(datum);
  }

  return arr;
};

class SheetRowDatum extends Object {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
import db from '../models/index';

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  User,
  Sheet: db.Sheet,
  SheetRow,
  SheetRowDatum,
};
