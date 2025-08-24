import { ChecklistTemplate } from '@prisma/client'

export interface ChecklistItem {
  id: string
  label: string
  required: boolean
  done: boolean
  actorRole?: string
}

export const CHECKLIST_TEMPLATES: Record<ChecklistTemplate, ChecklistItem[]> = {
  [ChecklistTemplate.GENESIS_AGENT]: [
    { id: 'handle', label: 'Reserve handle & display name', required: true, done: false },
    { id: 'statement', label: 'Upload 1-paragraph Statement', required: true, done: false },
    { id: 'persona', label: 'Add one persona v0 (prompt + alignment notes)', required: true, done: false },
    { id: 'wallet', label: 'Register primary wallet (vault pointer)', required: true, done: false },
    { id: 'social', label: 'Link primary social (Farcaster recommended)', required: true, done: false },
    { id: 'artifact', label: 'Upload 1 model artifact pointer (ckpt/lora)', required: false, done: false },
    { id: 'creations', label: 'Publish first 3 creations (can be drafts)', required: false, done: false },
    { id: 'covenant', label: 'Sign Graduation covenant', required: false, done: false }
  ],
  [ChecklistTemplate.TRAINER]: [
    { id: 'bio', label: 'Add bio & links', required: true, done: false },
    { id: 'notes', label: 'Add trainer notes (how to supervise outputs)', required: false, done: false },
    { id: 'approve_persona', label: 'Approve persona v0', required: false, done: false },
    { id: 'approve_creations', label: 'Approve first 3 creations', required: false, done: false }
  ],
  [ChecklistTemplate.CURATOR]: [
    { id: 'tag_creations', label: 'Tag 10 existing creations with curation tags', required: false, done: false },
    { id: 'exhibition', label: 'Propose 1 mini-exhibition config', required: false, done: false }
  ],
  [ChecklistTemplate.COLLECTOR]: [
    { id: 'wallet', label: 'Register preferred wallet', required: true, done: false },
    { id: 'interests', label: 'Select areas of interest', required: false, done: false },
    { id: 'preview', label: 'Opt-in to preview pipeline', required: false, done: false }
  ],
  [ChecklistTemplate.INVESTOR]: [
    { id: 'profile', label: 'Complete investor profile', required: true, done: false },
    { id: 'criteria', label: 'Define investment criteria', required: false, done: false },
    { id: 'notifications', label: 'Configure notification preferences', required: false, done: false }
  ]
}

export function calculateProgress(items: ChecklistItem[]): number {
  if (items.length === 0) return 0
  const completed = items.filter(item => item.done).length
  return Math.round((completed / items.length) * 100)
}

export function getRequiredItems(template: ChecklistTemplate): ChecklistItem[] {
  return CHECKLIST_TEMPLATES[template].filter(item => item.required)
}

export function isChecklistComplete(items: ChecklistItem[]): boolean {
  const requiredItems = items.filter(item => item.required)
  return requiredItems.every(item => item.done)
}