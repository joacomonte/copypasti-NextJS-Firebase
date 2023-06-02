"use client"

import styles from "./page.module.css"

import { generateRandomCode } from "../utils/generateRandomCode"
import { Entry } from "../interfaces/types"
import db from "../db/firebase"

import { doc, setDoc, getDoc } from "firebase/firestore"
import { useState } from "react"

export default function Home() {
  const [textToCopy, setTextToCopy] = useState("")
  const [codeToFetch, setCodeToFetch] = useState("")
  const [fetchedEntry, setFetchedEntry] = useState<string | null>(null)
  const [savedCode, setSavedCode] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const docRef = doc(db, "copypastis_Collection", "copyPastis_Doc")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsSaving(true) // Start the saving state

    // Fetch the existing document data or creates a new one
    const docSnapshot = await getDoc(docRef)
    const existingData = docSnapshot.exists() ? docSnapshot.data() : {}

    // Generate a random code and save the text
    const newCode = generateRandomCode(3)
    await setDoc(docRef, {
      ...existingData,
      [newCode]: textToCopy,
    })

    // Set the saved code and stop the saving state
    setSavedCode(newCode)
    setIsSaving(false)
      // Reset savedCode to null after 5 seconds
  setTimeout(() => {
    setSavedCode(null);
  }, 10000);
  }

  async function handleFetch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      const fetchedData = docSnapshot.data() as Entry
      const fetchedEntry = fetchedData[codeToFetch] || null
      setFetchedEntry(fetchedEntry)
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Copy-Pasty</h1>
      </section>
      <section className={styles.card}>
        <form
          className={styles.textForm}
          onSubmit={handleSubmit}>
          <p>Text here</p>
          <textarea
            name="textToCopy"
            value={textToCopy}
            onChange={e => setTextToCopy(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSaving}>
            Save
          </button>
          {isSaving && <p>Loading...</p>}
        </form>
        {savedCode && (
          <div>
            <p>Saved Code:</p>
            <p>{savedCode}</p>
          </div>
        )}
        <form
          className={styles.codeForm}
          onSubmit={handleFetch}>
          <p>The secret code here</p>
          <input
            type="digits"
            name="codeToFetch"
            value={codeToFetch}
            onChange={e => {
              if (e.target.value.length <= 3) {
                setCodeToFetch(e.target.value)
              }
            }}
          />
          <button type="submit">Ver mensaje</button>
        </form>
        {fetchedEntry && (
          <div style={{wordBreak: 'break-all'}}>
            <p>El mensaje es: {fetchedEntry}</p>
          </div>
        )}
      </section>
    </main>
  )
}
