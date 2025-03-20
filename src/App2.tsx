// @ts-nocheck
import { useCallback, useEffect, useState, useRef } from '@lynx-js/react'
import './App2.css'

export function NewScreen() {
  const [inputValue, setInputValue] = useState('')
  const [greeting, setGreeting] = useState('')
  const [showInstructions, setShowInstructions] = useState(true)
  const [previewWidth, setPreviewWidth] = useState(100) // Ancho inicial en px para el preview
  const previewRef = useRef(null)

  useEffect(() => {
    console.info('NewScreen mounted')
    console.info('Inicializado el campo de texto')
  }, [])

  // Referencia para almacenar el timer del debounce
  const debounceTimerRef = useRef(null)

  // Esta función ajusta el tamaño del texto de preview según el contenido
  const adjustPreviewSize = useCallback((text) => {
    // Cancelar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Crear un nuevo timer para retrasar la actualización (debounce)
    debounceTimerRef.current = setTimeout(() => {
      // Calcular un ancho aproximado basado en el número de caracteres
      const minWidth = 100 // Ancho mínimo
      const maxWidth = 400 // Ancho máximo para evitar que crezca demasiado
      const charWidth = 8 // Ancho aproximado por carácter (reducido)
      const padding = 24 // Padding total (izquierdo y derecho)
      
      // Limitar el cálculo a un valor máximo para evitar problemas de rendimiento
      const calculatedWidth = Math.min(
        maxWidth, 
        Math.max(minWidth, Math.min(text.length, 50) * charWidth + padding)
      )
      
      setPreviewWidth(calculatedWidth)
      console.info('Ajustando tamaño del preview:', calculatedWidth)
    }, 100) // 100ms de retraso
  }, [])

  const handleInputChange = useCallback((e) => {
    const value = e.detail?.value || e.value || e.target?.value || ''
    setInputValue(value)
    // Ajustar el tamaño del preview basado en el texto
    adjustPreviewSize(value)
    console.info('Valor del input cambiado a:', value)
  }, [adjustPreviewSize])
  
  {/*funcion para manejar el evento de clic en el botón
    lo primero que hace es volver falsa el InstructionContainer que es el que
    muestra el texto de presiona un boton entonces ya no se mostrara, despues
    lo que hace es ver si la variable inputValue tiene algo, y si tiene algo pues
    lo que hace es mostrar el texto de saludo con lo que esta dentro de la variable,
    y si no pues lo que hace es mandar un mensaje de error*/}
  const handleButtonClick = useCallback(() => {
    setShowInstructions(false)
    if (inputValue && inputValue.trim() !== '') {
      setGreeting(`¡Hola ${inputValue}! Bienvenido a Lynx JS`)
    } else {
      setGreeting('Por favor, ingresa tu nombre primero')
    }
    console.info('Botón presionado, valor actual:', inputValue)
  }, [inputValue])

  return (
    <view>
        {/*vista principal*/}
      <view className="ScreenContainer">
        {/*cabecera*/}
        <view className="Header">
          {/*titulo*/}
          <text className="HeaderTitle">Mi Primera App con Lynx JS</text>
        </view>
        {/*contenido*/}
        <view className="Content">
          {/* Mensaje de instrucción que desaparece al hacer clic en el botón 
            Entonces lo que hace es que verifica si la variable showinstructions es verdadera
            para asi pasar a mostrar el texto, y si no pues no lo muestra*/}
          {showInstructions && (
          <view className="InstructionContainer">
            <text className="InstructionText">Presiona el botón para saludarte</text>
          </view>
          )}
          
          {/*Label para el campo de entrada*/}
          <text className="InputLabel">Ingresa tu nombre aquí:</text>
          
          {/*Contenedor para el input con tamaño fijo*/}
          <view className="InputContainer">
            <input 
              bindinput={handleInputChange}
              placeholder="Escribe tu nombre" 
              value={inputValue}
              focus={true}
              className="InputField"
              type="text"
            />
          </view>
          
          {/*Texto que muestra el valor actual - este se expande*/}
          {inputValue && (
            <view ref={previewRef} className="PreviewContainer" style={{ width: `${previewWidth}px` }}>
              <text className="InputPreview">Texto actual: {inputValue}</text>
            </view>
          )}
          
          <view bindtap={handleButtonClick} className="ActionButton">
            <text>Presiona</text>
          </view>
          
          {greeting && (
            <text className={greeting.includes('Por favor') ? "ErrorMessage" : "Message"}>
              {greeting}
            </text>
          )}
        </view>
      </view>
    </view>
  )
}