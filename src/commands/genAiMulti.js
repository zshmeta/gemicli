import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { genAI, model } from '../utils/config';

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function genAiMulti(prompt, imagePaths) {
  const genModel = genAI.generateContent(model());
  const imageParts = imagePaths.map(path => fileToGenerativePart(path, 'image/jpeg'));

  const result = await genModel.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

export { genAiMulti };
