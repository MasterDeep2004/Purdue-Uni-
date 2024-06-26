import { Category } from "./category.model";

export interface MainUpdateModel {
    title: string;
    rawDescription: string;
    richDescription: string;
    category: Category[];
}