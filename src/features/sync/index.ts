import type { Note, Notebook } from '../notes/types'

export interface SyncAdapter {
  name: string
  list(): Promise<{ notes: Note[]; notebooks: Notebook[] }>
  push(data: { notes: Note[]; notebooks: Notebook[] }): Promise<void>
  pull(): Promise<{ notes: Note[]; notebooks: Notebook[] }>
  resolve(conflicts: any[]): Promise<void>
}

export class NotImplementedError extends Error {
  constructor(message = 'Not implemented') {
    super(message)
    this.name = 'NotImplementedError'
  }
}
