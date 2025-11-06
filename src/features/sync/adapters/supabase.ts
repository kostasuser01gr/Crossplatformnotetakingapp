import type { SyncAdapter } from '../index'
import { NotImplementedError } from '../index'

export const supabaseAdapter: SyncAdapter = {
  name: 'supabase',
  
  async list() {
    throw new NotImplementedError('Supabase adapter not yet implemented')
  },
  
  async push() {
    throw new NotImplementedError('Supabase adapter not yet implemented')
  },
  
  async pull() {
    throw new NotImplementedError('Supabase adapter not yet implemented')
  },
  
  async resolve() {
    throw new NotImplementedError('Supabase adapter not yet implemented')
  }
}
