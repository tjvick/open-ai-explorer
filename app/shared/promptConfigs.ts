export type PromptConfig = {
  title: string;
  inputPlaceholder: string;
  submitText: string;
  promptGenerator: (input: string) => string;
  promptSystemMessage?: string;
}

export const promptConfigs: { [name: string]: PromptConfig} = {
  animal: {
    title: "Name my superhero pet",
    inputPlaceholder: "Enter an Animal",
    submitText: "Generate Names",
    promptGenerator: (animal: string) => {
      const capitalizedAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
      return `Suggest three names for an animal that is a superhero.
      
      Animal: Cat
      Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
      Animal: Dog
      Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
      Animal: ${capitalizedAnimal}
      Names:`;
    }
  },
  travelAgent: {
    title: "Recommend a museum",
    inputPlaceholder: "Enter a Location",
    submitText: "Generate Recommendations",
    promptSystemMessage: "I want you to act as a travel guide. I will write you my location and you will suggest a place to visit near my location. In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location.",
    promptGenerator: (location: string) => {
      return `I am in ${location} and I want to visit only museums.`;
    }
  }
}