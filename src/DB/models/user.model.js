import mongoose, { Schema } from 'mongoose';

export const genderTypes = {
    male: 'male',
    female: 'female',
};
export const roleTypes = {
    user: 'user',
    admin: 'admin',
    superAdmin: 'superAdmin',
};

const userSchema = new Schema(
    {
        name: {
            type: String,
            minLength: 3,
            maxLength: 50,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        phone: String,
        gender: {
            type: String,
            enum: Object.values(genderTypes),
            default: genderTypes.male,
        },
        role: {
            type: String,
            enum: Object.values(roleTypes),
            default: roleTypes.user,
        },
        password: {
            type: String,
            required: true,
        },
        isDeleted: Date,
        image: { secure_url: String, public_id: String },
        updatedBy: { type: Schema.ObjectId, ref: 'User' },
        deletedBy: { type: Schema.ObjectId, ref: 'User' },
        changeCredentialsTime: Date,
        DOB: Date,
        resetPasswordOtp: String,
        confirmEmailOtp: String,
        confirmEmail: {
            type: Boolean,
            default: false,
        },
        address: String,
    },
    {
        timestamps: true,
    },
);

export const userModel =
    mongoose.models.User || mongoose.model('User', userSchema);
