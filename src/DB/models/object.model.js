import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 3,
            maxLEngth: 50,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            minLength: 3,
            maxLength: 50000,
        },
        attachments: [{ secure_url: String, public_id: String }],
        model: String,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        DeletedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        newOwner: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        isDeleted: Date,
        currentPrice: String,
        basePrice: String,
        bidders: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        changeCredentialsTime: Date,
        permanentDeleteAt: Date,
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    },
);

objectSchema.virtual('auctions', {
    localField: '_id',
    foreignField: 'objectId',
    ref: 'Auction',
});

objectSchema.index({ permanentDeleteAt: 1 }, { expireAfterSeconds: 0 });

export const objectModel =
    mongoose.models.Object || mongoose.model('Object', objectSchema);
