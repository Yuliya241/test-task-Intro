import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

import { IDBPDatabase, openDB } from 'idb';

import { Category, Item } from '../../interfaces/interfaces';

@Component({
  selector: 'app-collapsible-list',
  standalone: true,
  templateUrl: './collapsible-list.component.html',
  styleUrls: ['./collapsible-list.component.scss'],
  imports: [CommonModule],
})
export class CollapsibleListComponent implements OnInit {
  isOpen = false;
  displayText = 'Выберите элементы';
  categories: Category[] = [];
  private db!: IDBPDatabase;

  async ngOnInit() {
    await this.initializeDB();
    await this.loadState();
  }

  async initializeDB() {
    this.db = await openDB('SelectionComponentDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state');
        }
      },
    });
  }

  async loadState() {
    const state = await this.db.get('state', 'selectionState');
    if (state) {
      this.categories = state;
    } else {
      this.initializeCategories();
    }
    this.updateDisplayText();
  }

  initializeCategories() {
    this.categories = [
      {
        id: 'funnels',
        name: 'Воронки',
        isOpen: false,
        selectedCount: 0,
        items: [
          { id: 'funnel1', name: 'Воронка 1', selected: false },
          { id: 'funnel2', name: 'Воронка 2', selected: false },
        ],
      },
      {
        id: 'stages',
        name: 'Этапы',
        isOpen: false,
        selectedCount: 0,
        items: [
          { id: 'stage1', name: 'Этап 1', selected: false },
          { id: 'stage2', name: 'Этап 2', selected: false },
          { id: 'stage3', name: 'Этап 3', selected: false },
        ],
      },
    ];
  }

  toggleDropdown(event: MouseEvent) {
    this.isOpen = !this.isOpen;
    event.stopPropagation();
  }

  toggleCategory(category: Category) {
    category.isOpen = !category.isOpen;
  }

  toggleItemSelection(category: Category, item: Item) {
    item.selected = !item.selected;
    category.selectedCount = category.items.filter((i) => i.selected).length;
    this.updateDisplayText();
    this.saveState();
  }

  updateDisplayText() {
    const selected = this.categories
      .map(
        (c) =>
          `${c.selectedCount} ${c.name === 'Воронки' ? 'воронки' : 'этапов'}`
      )
      .filter((text) => !text.startsWith('0'))
      .join(', ');
    this.displayText = selected ? `Выбрано: ${selected}` : 'Выберите элементы';
  }

  async saveState() {
    await this.db.put('state', this.categories, 'selectionState');
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    if (!event.target || !(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen = false;
    }
  }
}
