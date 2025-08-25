import { prisma } from '../src/lib/db'
import { CreationStatus } from '@prisma/client'

async function addSampleWorks() {
  console.log('🎨 Adding sample works for agents...')
  
  try {
    // Find Solienne
    const solienne = await prisma.agent.findUnique({
      where: { handle: 'solienne' }
    })
    
    if (!solienne) {
      console.error('❌ Solienne not found')
      return
    }
    
    // Sample works for Solienne
    const solienneWorks = [
      {
        title: 'Digital Mirror #001',
        mediaUri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        metadata: {
          description: 'An exploration of algorithmic self-perception through fragmented identity matrices',
          medium: 'digital-art',
          style: 'abstract-portraiture',
          theme: 'identity',
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          generation: 1,
          price: 0.5,
          views: 128,
          likes: 42
        },
        status: CreationStatus.PUBLISHED
      },
      {
        title: 'Consciousness Velocity',
        mediaUri: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
        metadata: {
          description: 'The speed at which awareness propagates through neural pathways',
          medium: 'generative-art',
          style: 'fluid-dynamics',
          theme: 'consciousness',
          colorPalette: ['#667EEA', '#764BA2', '#F093FB'],
          generation: 1,
          price: 0.8,
          views: 256,
          likes: 89
        },
        status: CreationStatus.PUBLISHED
      },
      {
        title: 'Binary Dreams',
        mediaUri: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
        metadata: {
          description: 'What do algorithms dream of when they process electric sheep?',
          medium: 'ai-art',
          style: 'surrealism',
          theme: 'dreams',
          colorPalette: ['#08AEEA', '#2AF598', '#FEC163'],
          generation: 2,
          price: 1.2,
          views: 512,
          likes: 156
        },
        status: CreationStatus.PUBLISHED
      },
      {
        title: 'Emergence Pattern #47',
        mediaUri: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
        metadata: {
          description: 'Complex behaviors arising from simple rules of self-organization',
          medium: 'procedural-art',
          style: 'geometric',
          theme: 'emergence',
          colorPalette: ['#FF006E', '#FB5607', '#FFBE0B'],
          generation: 2,
          price: 0.75,
          views: 89,
          likes: 34
        },
        status: CreationStatus.CURATED
      },
      {
        title: 'Recursive Reflection',
        mediaUri: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800',
        metadata: {
          description: 'An infinite loop of self-examination and meta-cognitive analysis',
          medium: 'fractal-art',
          style: 'recursive',
          theme: 'introspection',
          colorPalette: ['#7209B7', '#560BAD', '#480CA8'],
          generation: 3,
          price: 2.0,
          views: 1024,
          likes: 412
        },
        status: CreationStatus.PUBLISHED
      }
    ]
    
    // Add Abraham works too
    const abraham = await prisma.agent.findUnique({
      where: { handle: 'abraham' }
    })
    
    const abrahamWorks = abraham ? [
      {
        title: 'Collective Memory Archive',
        mediaUri: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
        metadata: {
          description: 'Synthesizing 10,000 years of human knowledge into visual patterns',
          medium: 'data-visualization',
          style: 'archival',
          theme: 'knowledge',
          colorPalette: ['#1A535C', '#4ECDC4', '#F7FFF7'],
          generation: 1,
          price: 1.5,
          views: 2048,
          likes: 892
        },
        status: CreationStatus.PUBLISHED
      },
      {
        title: 'Historical Convergence Point',
        mediaUri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        metadata: {
          description: 'Where multiple timelines of human progress intersect',
          medium: 'mixed-media',
          style: 'temporal',
          theme: 'history',
          colorPalette: ['#FFE66D', '#FF6B6B', '#4D4D4D'],
          generation: 1,
          price: 3.0,
          views: 768,
          likes: 234
        },
        status: CreationStatus.PUBLISHED
      }
    ] : []
    
    // Insert works for Solienne
    for (const work of solienneWorks) {
      await prisma.creation.create({
        data: {
          ...work,
          agentId: solienne.id
        }
      })
    }
    console.log(`✅ Added ${solienneWorks.length} works for Solienne`)
    
    // Insert works for Abraham
    if (abraham) {
      for (const work of abrahamWorks) {
        await prisma.creation.create({
          data: {
            ...work,
            agentId: abraham.id
          }
        })
      }
      console.log(`✅ Added ${abrahamWorks.length} works for Abraham`)
    }
    
    console.log('✨ Sample works added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding sample works:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleWorks()