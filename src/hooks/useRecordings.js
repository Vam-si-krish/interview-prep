import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { APP_ID } from '../lib/config'

export function useRecordings(questionId, userId) {
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const fetchRecordings = useCallback(async () => {
    if (!questionId || !userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('app_id', APP_ID)
      .eq('question_id', questionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) console.error('Fetch recordings failed:', error)
    else setRecordings(data || [])
    setLoading(false)
  }, [questionId, userId])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings])

  const upload = useCallback(async ({ blob, duration }) => {
    setUploadError(null)
    const timestamp = Date.now()
    const filePath = `${APP_ID}/${userId}/${questionId}/${timestamp}.webm`

    // Step 1: Upload audio file to storage
    const { error: storageErr } = await supabase.storage
      .from('recordings')
      .upload(filePath, blob, { contentType: 'audio/webm' })

    if (storageErr) {
      const msg = `Storage upload failed: ${storageErr.message}`
      console.error(msg, storageErr)
      setUploadError(msg)
      return null
    }

    // Step 2: Get the public URL
    const { data: urlData } = supabase.storage
      .from('recordings')
      .getPublicUrl(filePath)

    // Step 3: Save metadata to DB
    const { data, error: dbErr } = await supabase
      .from('recordings')
      .insert({
        app_id: APP_ID,
        user_id: userId,
        question_id: questionId,
        file_url: urlData.publicUrl,
        file_path: filePath,
        duration,
      })
      .select()
      .single()

    if (dbErr) {
      const msg = `DB save failed: ${dbErr.message}`
      console.error(msg, dbErr)
      setUploadError(msg)
      // Clean up the orphaned storage file
      await supabase.storage.from('recordings').remove([filePath])
      return null
    }

    setRecordings(prev => [data, ...prev])
    return data
  }, [questionId, userId])

  const remove = useCallback(async (recording) => {
    await supabase.storage.from('recordings').remove([recording.file_path])
    await supabase.from('recordings').delete().eq('id', recording.id)
    setRecordings(prev => prev.filter(r => r.id !== recording.id))
  }, [])

  return { recordings, loading, uploadError, upload, remove, refetch: fetchRecordings }
}
