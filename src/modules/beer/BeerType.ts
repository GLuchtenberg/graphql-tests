import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import { registerType } from '../../interface/NodeInterface';

const BeerType = registerType(
  new GraphQLObjectType({
    name: 'Beer',
    description: 'beers on system',
    fields: () => ({
      id: globalIdField('Beer'),
      _id: {
        type: GraphQLString,
        resolve: beer => beer._id,
      },
      name: {
        type: GraphQLString,
        resolve: beer => beer.name,
      },
      quantity: {
        type: GraphQLInt,
        resolve: beer => beer.quantity,
      },
      active: {
        type: GraphQLBoolean,
        resolve: beer => beer.active,
      },
    }),
  }),
);

export default BeerType;

export const BeerConnection = connectionDefinitions({
  name: 'Beer',
  nodeType: GraphQLNonNull(BeerType),
});
