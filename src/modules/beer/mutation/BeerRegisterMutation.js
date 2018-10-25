// @flow
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import BeerType from '../BeerType';
import BeerModel from '../BeerModel';

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
    let beer = await BeerModel.findOne({ name: name.toLowerCase() });

    if (beer) {
      return {
        error: 'Already in our database',
      };
    }

    beer = new BeerModel({
      name,
      quantity,
    });

    await beer.save();
    return { beer };
  },
  outputFields: {
    beer: {
      type: BeerType,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
