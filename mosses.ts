interface Moss {
  id: string;
  minHumidity: number;
  maxHumidity: number;
  mutationChange: number;
}

interface Ambient {
  humidity: number;
  salts: number;
}

const baseRoundMathValue = 100;

function getDecimalRounded(values: number[]) {
  let result: number = 0;
  values.forEach((value) => (result += value * baseRoundMathValue));
  return Math.round(result) / baseRoundMathValue;
}

const ambient = createAmbient();

function createAmbient() {
  return { humidity: 0.5, salts: 200 };
}

function generateRandomColor(): string {
  return "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
}

function createMoss() {
  return {
    id: generateRandomColor(),
    mutationChange: 0.05,
    minHumidity: 0.3,
    maxHumidity: 0.6,
  };
}

const initialSample = createInitialSample(5);

function createInitialSample(sampleSize: number): Moss[] {
  const sampleArray: Moss[] = [];
  for (let i = 0; i < sampleSize; i++) sampleArray.push(createMoss());
  return sampleArray;
}

function simulate(samples: Moss[], cycles: number) {
  let iteratedSamples: Moss[] = [];

  for (let i = 0; i < cycles; i++) {
    samples.forEach((moss) => {
      const insideHumidityRange =
        moss.minHumidity <= ambient.humidity &&
        moss.maxHumidity >= ambient.humidity;

      if (insideHumidityRange) {
        const changeValue = getDecimalRounded([Math.random()]);
        if (changeValue < moss.mutationChange) moss = mutate(moss);
        iteratedSamples.push(moss);
      }
    });
    samples = iteratedSamples.map((sample) => sample);
    iteratedSamples = [];
  }

  return samples;
}

const canMutateProperties = [`minHumidity`, `maxHumidity`];

function selectRandomPropertie(properties: string[]): string {
  return properties[Math.floor(Math.random() * properties.length)];
}

function mutate(moss: Moss): Moss {
  const selectedPropertie = selectRandomPropertie(canMutateProperties);
  const isNegative: boolean = Math.random() < 0.5;
  const baseParsedValue = moss[selectedPropertie];
  const mutatedValue = Math.random() * 0.05;
  const result = baseParsedValue + (isNegative ? -mutatedValue : mutatedValue);
  moss[selectedPropertie] = getDecimalRounded([result]);
  return moss;
}

function startSimulation() {
  console.log(`Simulation Start`);
  let samples: Moss[] = createInitialSample(10);
  console.log(`Initial State`);
  console.log(samples);

  const timespan: number = 1000;
  samples = simulate(samples, timespan);

  console.log(`Final State`);
  console.log(samples);

  console.log(`Simulation End`);
}

startSimulation();
