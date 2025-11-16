'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-amber-600 p-3 border border-amber-950 hover:bg-black text-white rounded-2xl" onClick={() => signIn()}>Sign in</button>
    </>
  )
}