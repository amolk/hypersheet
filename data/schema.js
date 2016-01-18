/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  connectionFromPromisedArray,
} from 'graphql-relay';

import {
  resolveArrayData
} from 'sequelize-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Sheet,
  SheetRow,
  SheetRowDatum,
  getUser,
  getViewer,
} from './database';

import _ from 'lodash';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    console.log(`globalId = ${globalId}`);
    var {type, id} = fromGlobalId(globalId);
    console.log("type = " + type);
    console.log("id = " + id);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Sheet') {
      return Sheet.findById(id);
    } else if (type === 'SheetRow') {
      return SheetRow.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
    console.log("obj = " + obj);
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Sheet)  {
      return sheetType;
    } else if (obj instanceof SheetRow)  {
      return sheetRowType;
    } else {
      return null;
    }
  }
);

const sheetRowDatumType = new GraphQLObjectType({
  name: 'SheetRowDatum',
  fields: {
    key: {
      type: GraphQLString,
      description: 'The key of the datum',
      resolve: (datum) => datum.key
    },
    value: {
      type: GraphQLString,
      description: 'The value of the datum',
      resolve: (datum) => datum.value
    },
  },
});

const sheetRowType = new GraphQLObjectType({
  name: 'SheetRow',
  fields: {
    id: globalIdField(SheetRow.name),
    data: {
      type: new GraphQLList(sheetRowDatumType),
      resolve: (sheetRow, args) => {
        return SheetRow.getData(sheetRow)
      },
    },
  },
  interfaces: [nodeInterface]
});

var {connectionType: sheetRowsConnection} =
  connectionDefinitions({name: 'SheetRow', nodeType: sheetRowType});

var sheetRowConnectionArgs = _.clone(connectionArgs);
sheetRowConnectionArgs.columns = {
  type: new GraphQLList(GraphQLString),
  description: 'The columns to return'
};

const sheetType = new GraphQLObjectType({
  name: 'Sheet',
  fields: {
    id: globalIdField(Sheet.name),
    name: {
      type: GraphQLString,
      description: 'The name of the sheet',
      resolve: (sheet) => sheet.name
    },
    // columns: {
    //   tye: new GraphQLList(sheetColumnType),
    //   description: 'A sheet\'s collection of columns',
    //   resolve: (sheet) => sheet.getColumns()
    // },
    rows: {
      type: sheetRowsConnection,
      description: 'A sheet\'s rows',
      args: sheetRowConnectionArgs,
      resolve: (sheetInfo, args) => {
        return new Promise(function(resolve, reject) {
          Sheet.findById(sheetInfo.id).then(function(sheet) {
            resolve(connectionFromPromisedArray(
              sheet.rows(args),
              args
            ));
          });
        });
      }
    }
  },
  interfaces: [nodeInterface]
});

var {connectionType: sheetConnection} =
  connectionDefinitions({name: 'Sheet', nodeType: sheetType});

// userType
var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    sheets: {
      type: sheetConnection,
      description: 'A person\'s collection of sheets',
      args: connectionArgs,
      resolve: (user, args) => {
        return connectionFromPromisedArray(
          resolveArrayData(Sheet.findAll()),
          args
        );
      }
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    currentUser: {
      type: userType,
      resolve: () => getViewer(),
    },

    sheets: {
      type: sheetConnection,
      description: 'A person\'s collection of sheets',
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Sheet), args)
    },

  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
