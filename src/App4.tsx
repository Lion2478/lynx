// @ts-nocheck
import { useCallback, useState, useEffect } from '@lynx-js/react'
import './App4.css'

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

    const handleGenerateQR = useCallback(() => {
        const ticketData = {
            event: "Nombre del Evento",
            date: "2025-03-20",
            location: "Lugar del Evento",
            ticketId: "12345"
        }

        const ticketUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(ticketData))}`
        setQrImage(ticketUrl)
    }, [])

    return (
        <view className="body">
            <view className="content">
                <view className="header">
                    <text>Ticket QR</text>
                </view>
                <view className="square-container">
                    <view className="square">
                        {qrImage && <image src={qrImage} className="qrimage" />}
                    </view>
                </view>
                {qrImage && <text className="timer-text">El código QR expirará en 10 segundos</text>}
                <view className="text-container">
                    <text className="description-text">Escanea el código QR para ver tu ticket</text>
                </view>
                <view className="button-container">
                    <view bindtap={handleGenerateQR} className="action-button">
                        <text>Generar Ticket QR</text>
                    </view>
                </view>
            </view>
        </view>
    )
}