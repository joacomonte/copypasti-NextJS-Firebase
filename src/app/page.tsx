
import { revalidatePath } from 'next/cache';
import styles from './page.module.css'

interface iCopyPasty {
  code: string;
  text: string;
}

const copyPastyList: iCopyPasty[] = []
let textFound: string;

function generateRandomCode(length: number) {
  let code = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

export default function Home() {

  async function saveNewCopyPasty(data: FormData){
    "use server";
    const newCode = generateRandomCode(2);
    const copyPasty = data.get("textToCopy") as string;
    
    copyPastyList.push({
      text: copyPasty,
      code: newCode
    });
    revalidatePath("/");
  }
  

async function searchText(data: FormData){
  "use server"
  const codeInputed = data.get("codeInputed");

  const foundCopyPasty = copyPastyList.find(
    (item) => item.code.toString() === codeInputed
  );

  console.log("found ",foundCopyPasty)
  if (foundCopyPasty) {
    textFound = foundCopyPasty.text;
  } else {
    textFound = "no existe ningun copyPasty relacionado a ese code"
  }
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

        <form action={searchText}>
          <p>Code</p>
          <input name='codeInputed' type='text'/>
          <button type='submit'>get Text</button>
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

        <div style={{ margin: "50px" }}>
          {textFound && <p>{textFound}</p>}
        </div>

      </section>
    </main>
  )
}
