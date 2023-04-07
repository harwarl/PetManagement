import mongoose from 'mongoose';
import { Logging } from '../utils/Logging.js';

export default ({dbUrl})=>{
    const connect = ()=>{
        mongoose.connect(dbUrl)
        .then(()=>{
            Logging.info('DB Connected Successfully')
        })
        .catch(err=>{
            Logging.error('DB Error');
            Logging.error(err);
        })
    }

    connect();
}