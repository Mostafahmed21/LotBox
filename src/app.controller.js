import connectionDB from './DB/DB.connection.js';
import { globalErrorHandling } from './utils/response/error.response.js';
import authController from './modules/auth/auth.controller.js';
import userController from './modules/user/user.controller.js';
import objectController from './modules/object/obj.controller.js'; 
import cors from 'cors';
import helmet from 'helmet';

const bootstrap = async (app, express) => {
    
    app.use(cors())
    app.use(helmet());
    connectionDB();

    app.use(express.json());
    app.use('/auth', authController);
    app.use('/user', userController);
    app.use('/object', objectController);

    app.get('/', (req, res, next) => {
        res.status(200).json('server is runnning good');
    });

    app.use(globalErrorHandling);
};

export default bootstrap;
