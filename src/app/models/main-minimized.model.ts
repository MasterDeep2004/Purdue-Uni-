import { Category } from "./category.model";

export interface MainMinimizedExternal {
    id: string;
    title: string;
    preview: string;
    lastUpdateDateTime: Date;
    category: Category[];
}