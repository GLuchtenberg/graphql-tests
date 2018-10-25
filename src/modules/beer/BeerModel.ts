import mongoose, { Document, Model } from 'mongoose';


const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'beer',
  },
);

export interface IBeer extends Document {
  name: string;
  quantity?: number;
  active: boolean;
  getBeers: (numberOfBeers: number) => number;
  getBeer: () => number
  // encryptPassword: (password: string | undefined) => string;
}

schema.methods = {
  getBeers(numberOfBeers: number) {
    return this.quantity - numberOfBeers;
  },
  encryptPassword(password: string) {
    return this.getBeers(1)
  },
};

// this will make find, findOne typesafe
const BeerModel: Model<IBeer> = mongoose.model('Beer', schema);

export default BeerModel;
