import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { APP_ID } from '../lib/config'

export function useQuestions(topicId, userId) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !topicId) return
    setLoading(true)
    supabase
      .from('questions')
      .select('*')
      .eq('app_id', APP_ID)
      .eq('user_id', userId)
      .eq('topic', topicId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setQuestions(data || [])
        setLoading(false)
      })
  }, [topicId, userId])

  const addQuestion = useCallback(async (text) => {
    const { data, error } = await supabase
      .from('questions')
      .insert({ app_id: APP_ID, user_id: userId, topic: topicId, question_text: text.trim() })
      .select()
      .single()
    if (!error) setQuestions(prev => [...prev, data])
    return !error
  }, [topicId, userId])

  const deleteQuestion = useCallback(async (questionId) => {
    // Clean up storage files first
    const { data: recs } = await supabase
      .from('recordings')
      .select('file_path')
      .eq('question_id', questionId)
      .eq('app_id', APP_ID)
    if (recs?.length) {
      await supabase.storage.from('recordings').remove(recs.map(r => r.file_path))
    }
    // Delete question (CASCADE removes recording rows)
    await supabase.from('questions').delete().eq('id', questionId)
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }, [])

  return { questions, loading, addQuestion, deleteQuestion }
}
