import { Request } from 'express';
import { User } from './user.model';

interface ExtendedRequest extends Request {
    token: string,
    user: User,
}

export { ExtendedRequest }