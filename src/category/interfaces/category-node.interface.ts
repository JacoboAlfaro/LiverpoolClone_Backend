export interface CategoryNode {
  _id: string;
  name: string;
  image: string;
  parentId?: string | null;
  children?: CategoryNode[];
}
