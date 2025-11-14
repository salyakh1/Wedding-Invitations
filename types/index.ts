export interface InvitationBlock {
  id: string
  type: 'background' | 'names' | 'text' | 'video' | 'map' | 'story' | 'wishes' | 'wishes-slider' | 'wedding-date' | 'countdown' | 'dress-code' | 'guests'
  position: { x: number; y: number }
  size: { width: number; height: number }
  data: any
  opacity: number
  marginBottom?: number // Отступ снизу в пикселях
  // Индивидуальные настройки шрифта для каждого блока
  fontFamily?: string
  fontSize?: number
  textColor?: string
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
  // Настройки анимаций и эффектов
  animations?: {
    fadeIn?: boolean
    slideUp?: boolean
    scaleIn?: boolean
    staggered?: boolean
  }
  effects?: {
    parallax?: boolean
    particles?: boolean
    gradientAnimation?: boolean
    blurOnScroll?: boolean
    roseOpeningAnimation?: boolean
    romanticParticles?: boolean
  }
}

export interface Wish {
  id: string
  invitationId: string
  name: string
  message: string
  createdAt: string
}
