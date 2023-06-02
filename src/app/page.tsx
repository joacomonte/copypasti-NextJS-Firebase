"use client"

import styles from "./page.module.css"

import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBrTXD0aImX6tdIPl7LhoTUcvDE5J_r40s",
  authDomain: "sidepro-385422.firebaseapp.com",
  projectId: "sidepro-385422",
  storageBucket: "sidepro-385422.appspot.com",
  messagingSenderId: "80631964465",
  appId: "1:80631964465:web:19dcd01fb5d6bdbb460610",
  measurementId: "G-EJWB3NN0S6",
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type Entry = {
  [key: string]: string;
};

function generateRandomCode(length: number): string {
  let code = '';
  const characters = '123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

export default function Home() {
  const [textToCopy, setTextToCopy] = useState('');
  const [codeToFetch, setCodeToFetch] = useState('');
  const [fetchedEntry, setFetchedEntry] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false); // New state variable
  const docRef = doc(db, 'copypastis_Collection', 'copyPastis_Doc');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSaving(true); // Start the saving state

    // Fetch the existing document data
    const docSnapshot = await getDoc(docRef);
    const existingData = docSnapshot.exists() ? docSnapshot.data() : {};

    // Generate a random code and save the text
    const newCode = generateRandomCode(3);
    await setDoc(docRef, {
      ...existingData,
      [newCode]: textToCopy,
    });

    // Set the saved code and stop the saving state
    setSavedCode(newCode);
    setIsSaving(false);
  }

  async function handleFetch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const fetchedData = docSnapshot.data() as Entry;
      const fetchedEntry = fetchedData[codeToFetch] || null;
      setFetchedEntry(fetchedEntry);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Copy-Pasty</h1>
      </section>
      <section className={styles.card}>
        <form onSubmit={handleSubmit}>
          <p>Text</p>
          <input
            type="text"
            name="textToCopy"
            value={textToCopy}
            onChange={(e) => setTextToCopy(e.target.value)}
          />
          <button type="submit" disabled={isSaving}>Save</button>
          {isSaving && <p>Loading...</p>}
        </form>
        {savedCode && (
          <div>
            <p>Saved Code:</p>
            <p>{savedCode}</p>
          </div>
        )}
        <form onSubmit={handleFetch}>
          <p>Code to Fetch</p>
          <input
            type="text"
            name="codeToFetch"
            value={codeToFetch}
            onChange={(e) => setCodeToFetch(e.target.value)}
          />
          <button type="submit">Fetch</button>
        </form>
        {fetchedEntry && (
          <div>
            <p>Fetched Entry:</p>
            <p>{fetchedEntry}</p>
          </div>
        )}
      </section>
    </main>
  );
}