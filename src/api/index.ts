import ky from 'ky';
import { IData } from '../types';

export const getStatus = () => ky('https://www.githubstatus.com/api/v2/summary.json').json<IData>();
