import * as fs from "fs";
import * as xml2js from "xml2js";
import prisma from "../lib/db";
import { DELIMITER, SOURCE_FILE_PATH } from "../consts";

interface Synset {
  $: {
    wnid: string;
    words: string;
    gloss: string;
  };
  synset?: Synset | Synset[];
}

interface ImageNetStructure {
  ImageNetStructure: {
    releaseData: string[];
    synset: Synset;
  };
}

interface LinearEntry {
  name: string;
  size: number;
}

async function parseXML(filePath: string): Promise<ImageNetStructure> {
  const xml = fs.readFileSync(filePath, "utf-8");
  const parser = new xml2js.Parser({ explicitArray: false });
  return parser.parseStringPromise(xml);
}

function countSynsets(synset: Synset): number {
  if (!synset.synset) return 0;

  const children = Array.isArray(synset.synset)
    ? synset.synset
    : [synset.synset];
  return children.reduce(
    (count, child) => count + countSynsets(child),
    children.length
  );
}

function buildLinearStructure(
  synset: Synset,
  parentPath: string = ""
): LinearEntry[] {
  const currentPath = parentPath
    ? `${parentPath}${DELIMITER}${synset.$.words}`
    : synset.$.words;
  const size = countSynsets(synset);

  const entries = [{ name: currentPath, size }];

  if (synset.synset) {
    const children = Array.isArray(synset.synset)
      ? synset.synset
      : [synset.synset];
    children.forEach((child) => {
      entries.push(...buildLinearStructure(child, currentPath));
    });
  }

  return entries;
}

async function storeInDatabase(entries: LinearEntry[]) {
  const batchSize = 1000; // Adjust the batch size as needed
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    await prisma.imageNet.createMany({
      data: batch,
      skipDuplicates: true, // Optional: skips entries that would cause a unique constraint violation
    });
  }
}

async function main() {
  try {
    const parsedXML = await parseXML(SOURCE_FILE_PATH);
    const linearStructure = buildLinearStructure(
      parsedXML.ImageNetStructure.synset
    );
    await storeInDatabase(linearStructure);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
