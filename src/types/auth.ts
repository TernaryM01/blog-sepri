export type UserRole = 'admin' | 'user'

export interface UserRoleRecord {
  user_id: string
  role: UserRole
  created_at: string
}
