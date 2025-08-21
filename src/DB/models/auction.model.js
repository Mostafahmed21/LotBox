import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
    {
        price: String,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        objectId: {
            type: mongoose.Types.ObjectId,
            ref: 'Object',
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        deletedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        isDeleted: Date,
        changeCredentialsTime: Date,
    },
    { timestamps: true },
);

export const auctionModel =
    mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
