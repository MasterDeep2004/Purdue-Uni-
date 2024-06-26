export interface RelatedPageCollection {
    category: string;
    show: boolean;
    pages: RelatedPage[];
}

export interface RelatedPage {
    id: string;
    pageTitle: string;
    color: string;
}