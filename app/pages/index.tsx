import Head from 'next/head'
import React, {useState} from "react";
import {PromptConfig, promptConfigs} from "@/shared/promptConfigs";
import {Box, Drawer, List, ListItem, ListItemButton, ListItemText} from '@mui/material';

export default function Home() {
  const [input, setInput] = useState("");
  const [promptConfig, setPromptConfig] = useState({} as PromptConfig);
  const [promptType, setPromptType] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event: any) {
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

  function setThings(promptType: string, promptConfig: PromptConfig) {
    setPromptType(promptType);
    setPromptConfig(promptConfig);
    setResult("");
  }

  return (
    <>
      <Head>
        <title>OpenAI API Explorer</title>
        <meta name="description" content="Exploring the possiblities with OpenAI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>{
        <Box sx={{ display: 'flex' }}>
          <Drawer
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <List>
              {Object.entries(promptConfigs).map(([promptType, promptConfig ]) => (
                <ListItem key={promptType} dense={true}>
                  <ListItemButton onClick={() => setThings(promptType, promptConfig)}>
                    <ListItemText primary={promptConfig.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box
            component="main"
          >
            <div>
              <h3>{promptConfig.title}</h3>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  name="input"
                  placeholder={promptConfig.inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <input type="submit" value={promptConfig.submitText}/>
              </form>
              <div>
                {result}
              </div>
            </div>
          </Box>
        </Box>

      }</main>
    </>
  )
}
