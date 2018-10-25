// @flow

import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutation';
import BeerMutations from '../modules/beer/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...BeerMutations,
  }),
});
