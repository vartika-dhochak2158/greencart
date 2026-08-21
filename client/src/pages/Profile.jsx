import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function Profile() {
  const { user, setShowUserLogin, navigate } = useAppContext()
  return <div className="space-y-4 px-4 pb-8 pt-6"><h1 className="text-xl font-black">Profile</h1><div className="rounded-3xl border border-border bg-card p-5 shadow-card"><div className="mb-4 flex items-center gap-3"><span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-xl font-black text-primary">{user?.name?.[0] || 'VD'}</span><div><p className="font-black">{user?.name || 'Guest shopper'}</p><p className="text-sm text-muted-foreground">{user?.email || 'Sign in to manage your account'}</p></div></div>{user ? <button onClick={() => navigate('/my-orders')} className="w-full rounded-2xl bg-primary py-3 text-sm font-black text-white">View my orders</button> : <button onClick={() => setShowUserLogin(true)} className="w-full rounded-2xl bg-primary py-3 text-sm font-black text-white">Login</button>}</div></div>
}
