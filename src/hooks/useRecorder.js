import { useState, useRef, useCallback } from 'react'

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mediaRecorder.start()
    setIsRecording(true)
    setElapsed(0)

    timerRef.current = setInterval(() => {
      setElapsed(s => s + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    return new Promise(resolve => {
      const mr = mediaRecorderRef.current
      if (!mr) return resolve(null)

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        mr.stream.getTracks().forEach(t => t.stop())
        resolve({ blob, duration: elapsed })
      }

      mr.stop()
      clearInterval(timerRef.current)
      setIsRecording(false)
    })
  }, [elapsed])

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return { isRecording, elapsed, formattedTime: formatTime(elapsed), start, stop }
}
