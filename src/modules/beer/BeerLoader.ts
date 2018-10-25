import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import BeerModel, { IBeer } from './BeerModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Beer {
  id: string;

  _id: Types.ObjectId;

  name: string;

  quantity: number | undefined;

  active: boolean | null | undefined;

  constructor(data: IBeer, { beer }: GraphQLContext) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.quantity = data.quantity;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(BeerModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string): Promise<Beer | null> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.BeerLoader.load(id);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Beer(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.BeerLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IBeer) => dataloaders.BeerLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IBeer) => clearCache(context, id) && primeCache(context, id, data);

type BeerArgs = ConnectionArguments & {
  search?: string;
};
export const loadBeers = async (context: GraphQLContext, args: BeerArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const beers = BeerModel.find(where, { _id: 1 });

  return connectionFromMongoCursor({
    cursor: beers,
    context,
    args,
    loader: load,
  });
};
