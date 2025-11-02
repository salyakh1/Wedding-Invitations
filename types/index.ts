export interface InvitationBlock {
  id: string
  type: 'background' | 'names' | 'text' | 'video' | 'map' | 'story' | 'wishes' | 'wishes-slider' | 'wedding-date' | 'countdown'
  position: { x: number; y: number }
  size: { width: number; height: number }
  data: any
  opacity: number
}

export interface Invitation {
  id: string
  title: string
  backgroundImage?: string
  backgroundColor?: string
  backgroundMusic?: string
  fontFamily: string
  fontSize: number
  textColor?: string
  blocks: InvitationBlock[]
  createdAt: string
  updatedAt: string
}

export interface Wish {
  id: string
  invitationId: string
  name: string
  message: string
  createdAt: string
}
