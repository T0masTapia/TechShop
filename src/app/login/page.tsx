'use client'
import React, { useState } from 'react'
import { supabase } from '@/lib/Supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false) // Alternar entre Login y Registro
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Campos de formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (isRegister) {
        // --- FLUJO DE REGISTRO ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        if (data.user) {
          setMessage({ 
            type: 'success', 
            text: '¡Registro exitoso! Revisa tu correo para confirmar la cuenta.' 
          })
          setIsRegister(false)
        }
      } else {
        // --- FLUJO DE LOG-IN ---
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        setMessage({ type: 'success', text: '¡Sesión iniciada! Redirigiendo...' })
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1200)
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Ocurrió un error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#09090b] overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA*/}
      <div className="hidden lg:block lg:col-span-5 relative h-full bg-gradient-to-b from-blue-950/40 border-r border-gray-900 to-purple-950/40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1614018424573-67db2698947f?q=80&w=1200&auto=format&fit=crop')` 
          }}
        />
        {/* Capa de degradado encima de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Branding esquina inferior */}
        <div className="absolute bottom-10 left-10 z-10 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-black text-white">T</div>
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">Tech-Shop Co.</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario flotante */}
      <div className="col-span-1 lg:col-span-7 h-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        
        {/* Alertas Globales */}
        {message.text && (
          <div className={`w-full max-w-md mb-4 text-xs font-semibold p-3.5 rounded-xl border text-center ${
            message.type === 'success' 
              ? 'bg-green-950/20 border-green-500/40 text-green-400' 
              : 'bg-red-950/20 border-red-500/40 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full max-w-md flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-gray-800 bg-[#0c0c0e]">
          
          {/* Tarjeta Interna (Formulario) */}
          <div className="p-8 sm:p-10 bg-[#0c0c0e]">
            <h2 className="text-xl font-bold tracking-tight text-white mb-8 text-center">
              {isRegister ? 'Crea tu cuenta en Tech-Shop' : 'Inicia sesión en Tech-Shop'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Tomás Tapia"
                    className="w-full bg-[#121214] border border-gray-800 text-sm text-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.cl"
                  className="w-full bg-[#121214] border border-gray-800 text-sm text-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121214] border border-gray-800 text-sm text-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {!isRegister && (
                <button type="button" className="text-xs text-blue-500 hover:underline block font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full !mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-md transition-all text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? 'Procesando...' : isRegister ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
              </button>
            </form>
          </div>

          {/* Franja Inferior Conmutadora (Estilo la franja gris de tu captura) */}
          <div className="bg-[#121214] border-t border-gray-800/60 py-4 text-center text-sm">
            <span className="text-gray-400">
              {isRegister ? '¿Ya tienes cuenta? ' : '¿Eres nuevo? '}
            </span>
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setMessage({ type: '', text: '' })
              }}
              className="text-blue-500 hover:underline font-bold transition-colors"
            >
              {isRegister ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}