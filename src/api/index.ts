import axios from 'axios';
import { IData } from '../shared/types';

export const statusReq = () => axios.get<IData>('https://www.githubstatus.com/api/v2/summary.json', {
  timeout: 10_000 
});
