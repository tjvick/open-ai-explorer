import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {useState} from "react";
import {promptConfigs} from "@/shared/promptConfigs";


export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();

  function onSubmitGenerator(promptType: string) {
    return async function onSubmit(event: any) {
      event.preventDefault();
      try {
        const response = await fetch('/api/generate', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: input,
            promptType: promptType,
          }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        setResult(data.result);
        setInput("");
      } catch(error: any) {
        console.error(error);
        alert(error.message);
      }
    }
  }



  return (
    <>
      <Head>
        <title>OpenAI API Explorer</title>
        <meta name="description" content="Exploring the possiblities with OpenAI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>{
        Object.entries(promptConfigs).map(([promptType, promptConfig ]) =>
          <div key={promptType}>
            <h3>{promptConfig.title}</h3>
            <form onSubmit={onSubmitGenerator(promptType)}>
              <input
                type="text"
                name="input"
                placeholder={promptConfig.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <input type="submit" value={promptConfig.submitText}/>
            </form>
            <div className={styles.result}>
              {result}
            </div>
          </div>
        )
      }</main>
    </>
  )
}
