// @flow
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import BeerType, { BeerConnection } from '../BeerType';
import BeerModel from '../BeerModel';
import * as BeerLoader from '../BeerLoader';

export default mutationWithClientMutationId({
  name: 'BeerRegister',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  mutateAndGetPayload: async ({ name, quantity }) => {
    const hasBeer = await BeerModel.findOne({ name: name.toLowerCase() });

    if (hasBeer) {
      return {
        error: 'Already in our database',
      };
    }

    const beer = await new BeerModel({
      name,
      quantity,
    }).save();

    return {
      beer,
    };
  },
  outputFields: {
    beerEdge: {
      type: BeerConnection.edgeType,
      resolve: async ({ beer }, args, context) => {
        if (!beer) return null;

        const node = await BeerLoader.load(context, beer._id);
        return {
          cursor: toGlobalId('Beer', node.id),
          node,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
