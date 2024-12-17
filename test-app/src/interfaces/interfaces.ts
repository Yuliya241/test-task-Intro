export interface Item {
  id: string;
  name: string;
  selected: boolean;
}

export interface Category {
  id: string;
  name: string;
  isOpen: boolean;
  selectedCount: number;
  items: Item[];
}
