import { Category } from './category.model';
import { Files } from './files.model';
import { Links } from './links.model';

export interface Main {
  id: string;
  title: string;
  richDescription: string;
  rawDescription: string;
  category: Category[];
  files: Files[];
  links: Links[];
  author: string;
  createdDate: Date;
  lastUpdatedOn: Date;
}