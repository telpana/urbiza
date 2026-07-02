import { ImageResponse } from 'next/og'
import React from 'react'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'
export const revalidate = 86400

export default function Icon() {
  return new ImageResponse(
    React.createElement('div', {
      style: {
        background: '#006D77',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 330,
        fontWeight: 900,
        color: 'white',
        borderRadius: '90px',
        fontFamily: 'Arial Black, Arial, sans-serif',
      }
    }, 'H'),
    { width: 512, height: 512 }
  )
}
