import mongoose from 'mongoose';

const connectionDB = async () => {
    const connection = await mongoose
        .connect(process.env.DB_CONNECTION_URI)
        .then(() => {
            console.log('DB connection is successful');
        })
        .catch((err) => {
            console.log('DB connection is failed');
        });
};

export default connectionDB;
