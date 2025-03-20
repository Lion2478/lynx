// @ts-nocheck
import { useCallback, useState, useEffect } from '@lynx-js/react'
import './App3.css'

export function NewScreen() {
    const [qrImage, setQrImage] = useState('')

    useEffect(() => {
        if (qrImage) {
            const timer = setTimeout(() => {
                setQrImage('')
            }, 10000)
            return () => clearTimeout(timer)
        }
    }, [qrImage])

    const handleButtonClick = useCallback(() => {
        const ticketUrl = 'http://leonardo-hdz.lovestoblog.com/'
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketUrl)}`
        setQrImage(qrCodeUrl)
    }, [])

    return (
        <view className="body"> 
            <view className="header">
                <text>QR</text>
            </view>
            <view className="square-container">
                <view className="square">
                    {qrImage && <image src={qrImage} className="qrimage" />}
                </view>
            </view>
            {qrImage && <text className="timer-text">El código QR expirará en 10 segundos</text>}
            <view className="button-container">
                <view bindtap={handleButtonClick} className="action-button">
                    <text>Generar QR</text>
                </view>
            </view>
        </view>
    )
}
