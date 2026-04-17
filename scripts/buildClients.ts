import { createFromRoot } from "codama";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { renderVisitor } from "@codama/renderers-js";
import path from "path";
import { promises as fs } from "fs";

const dirname = import.meta.dirname;

const loadAnchorIDLs = async () => {
  const basePath = path.join(dirname, "../idls");
  const dirPath = path.join(basePath);

  try {
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const filePaths = jsonFiles.map((file) => path.join(dirPath, file));
    const fileContents = await Promise.all(
      filePaths.map((filePath) => fs.readFile(filePath, "utf-8"))
    );
    return fileContents.map((content) => JSON.parse(content) as AnchorIdl);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      throw new Error(`Failed to load IDL: ${dirPath} does not exist`);
    }
    throw err;
  }
};

async function main() {
  const idls = await loadAnchorIDLs();

  const programs = idls.map((idl) => {
    let name = "UnknownProgram";
    if ("metadata" in idl && idl.metadata && "name" in idl.metadata) {
      name = idl.metadata.name;
    }

    return {
      name: name,
      codama: createFromRoot(rootNodeFromAnchor(idl)),
    };
  });

  programs.map((program) => {
    const generatedPath = path.join(
      dirname,
      "../src/generated",
      program.name.toLowerCase()
    );
    program.codama.accept(renderVisitor(generatedPath));
    // codama.accept(renderVisitor(generatedPath));
  });
  // console.log(`Loaded ${idls.length} IDL files`);
  // console.log(idls[0]);
  // Here you would add logic to generate clients based on the IDL files
}

await main();
