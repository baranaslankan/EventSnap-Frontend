import { NextRequest } from 'next/server'

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }, method: string) {
  const path = params.path?.join('/') || ''
  const url = new URL(path, process.env.NEXT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001')
  url.search = request.nextUrl.search

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    // Omit host/origin-related headers that should be set by fetch
    if (['host', 'origin'].includes(key)) return
    headers[key] = value
  })

  const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.arrayBuffer()

  const res = await fetch(url.toString(), {
    method,
    headers,
    body,
    // allow following redirects from backend
    redirect: 'follow',
  })

  const resHeaders: Record<string, string> = {}
  res.headers.forEach((v, k) => {
    // strip hop-by-hop headers
    if (['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'upgrade'].includes(k)) return
    resHeaders[k] = v
  })

  const arrayBuffer = await res.arrayBuffer()
  return new Response(arrayBuffer, {
    status: res.status,
    headers: resHeaders,
  })
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'GET')
}
export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'POST')
}
export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'PUT')
}
export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'PATCH')
}
export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'DELETE')
}
export async function OPTIONS(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context, 'OPTIONS')
}
