export interface SearchAdapter {
  search(query: string): Promise<any[]>
  buildIndex(items: any[]): Promise<void>
  addToIndex(item: any): Promise<void>
  updateInIndex(item: any): Promise<void>
  removeFromIndex(itemId: string): Promise<void>
}
