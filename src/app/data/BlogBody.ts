import {Blog} from './Blog';

export class BlogBody {
    curPage: number;
    datas: Blog[];
    offset: number;
    over: boolean;
    pageCount: number;
    size: number;
    total: number;
}
