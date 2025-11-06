export type ID = string

export interface Notebook { 
  id: ID
  name: string
  createdAt: number 
}

export interface Note {
  id: ID
  notebookId: ID
  title: string
  // plaintext is derived from rich content for search; content is TipTap JSON (optionally encrypted)
  plaintext: string
  content: unknown
  tags: string[]
  createdAt: number
  updatedAt: number
  deleted?: boolean
}

export interface Revision { 
  id: ID
  noteId: ID
  at: number
  snapshot: unknown 
}

export interface Attachment { 
  id: ID
  noteId: ID
  name: string
  mime: string
  size: number
  data: Blob | ArrayBuffer 
}
