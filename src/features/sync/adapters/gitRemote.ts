import type { SyncAdapter } from '../index'
import { NotImplementedError } from '../index'

export const gitRemoteAdapter: SyncAdapter = {
  name: 'git-remote',
  
  async list() {
    throw new NotImplementedError('Git Remote adapter not yet implemented')
  },
  
  async push() {
    throw new NotImplementedError('Git Remote adapter not yet implemented')
  },
  
  async pull() {
    throw new NotImplementedError('Git Remote adapter not yet implemented')
  },
  
  async resolve() {
    throw new NotImplementedError('Git Remote adapter not yet implemented')
  }
}
