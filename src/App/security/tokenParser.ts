import jwt from 'jsonwebtoken';
import { environment } from '../../utils/environment';
import { promisify } from 'util';

const secret = environment.security.tokenSecret;

const sign = (payload: string | object | Buffer) => jwt.sign(payload, secret, { expiresIn: '7d' });
const verify = (token: string) => promisify(jwt.verify)(token, secret);

export { sign, verify }