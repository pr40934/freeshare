// export const videoDomain = 'https://cdn.share.net/'
export const videoDomain = 'https://cdn.greenheavens.life/'

const DOMAIN = 'http://localhost:8000' // Replace with your actual backend domain

export async function getVideoDetails(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${DOMAIN}/api/video-details/?key=${encodeURIComponent(key)}`)
    if (!res.ok) throw new Error('Failed to fetch video details')

    const data = await res.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    return null
  }
}


export async function sendViewData(payload: any) {
  try {
    const res = await fetch(`${DOMAIN}/api/view/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) console.error('sendViewData failed', await res.text())
  } catch (err) {
    console.error('sendViewData error', err)
  }
}
