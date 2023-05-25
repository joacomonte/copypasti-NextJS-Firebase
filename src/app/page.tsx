
import { revalidatePath } from 'next/cache';
import styles from './page.module.css'




interface iCopyPasty {
  code: number;
  text: string;
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const copyPastyList: iCopyPasty[] = []

export default function Home() {

async function saveNewCopyPasty(data: FormData){
  "use server";
  const newCode = generateRandomNumber(1000, 9999);
  const copyPasty = data.get("textToCopy") as string;
  
  copyPastyList.push({
    text: copyPasty,
    code: newCode
  });
  revalidatePath("/");
  
}

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>Copy-Pasty
        </h1>
      </section>
      <section className={styles.card}>

        <form action={saveNewCopyPasty}>
          <p>Text</p>
          <input 
            type='text-area'
            name='textToCopy'
          />
          <button type='submit'>Generate Code</button>
        </form>

        <form>
          <p>Code</p>
          <input name='codeToGet' type='number'/>
          <button type='submit'>Get text</button>
        </form>

        <div style={{margin: "50px"}}>
        {copyPastyList.length > 0 && (
          <div>
            <ul>
              {copyPastyList.length > 0 && (
                <>
                <h4>Your code is: </h4>
                <p>Code: {copyPastyList[copyPastyList.length - 1].code}</p>
                </>
              )}
            </ul>
          </div>
        )}
        </div>
      </section>
    </main>
  )
}
