import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { server } from '@/config'

// POST - Create new contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Lütfen tüm gerekli alanları doldurun' },
        { status: 400 }
      )
    }
    
    // Send to backend - server already includes "/v1"
    const response = await axios.post(`${server}/contact-form`, body)
    
    return NextResponse.json(response.data, { status: 201 })
  } catch (error: any) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Form gönderilemedi' },
      { status: error.response?.status || 500 }
    )
  }
}

// GET - Get all contact form submissions (authenticated)
export async function GET(req: NextRequest) {
  try {
    // Get token from cookies or headers
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      )
    }
    
    // server already includes "/v1"
    const response = await axios.get(`${server}/contact-form`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    return NextResponse.json(response.data, { status: 200 })
  } catch (error: any) {
    console.error('Get contact forms error:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Form verileri alınamadı' },
      { status: error.response?.status || 500 }
    )
  }
}

// DELETE - Delete a contact form submission (authenticated)
export async function DELETE(req: NextRequest) {
  try {
    // Get token from cookies or headers
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      )
    }
    
    // Get the ID from URL params
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Form ID gerekli' },
        { status: 400 }
      )
    }
    
    // server already includes "/v1"
    await axios.delete(`${server}/contact-form?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    return NextResponse.json(
      { message: 'Form başarıyla silindi' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete contact form error:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Form silinemedi' },
      { status: error.response?.status || 500 }
    )
  }
} 