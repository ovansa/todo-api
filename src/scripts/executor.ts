import { connectDB } from '../db';
import createUsersWithTodos from './createUsersWithTodos';

const scriptMap: { [key: string]: () => Promise<void> } = {
  createUsersWithTodos,
};

const executeScript = async (scriptName: string) => {
  const script = scriptMap[scriptName];

  if (!script) {
    console.error(
      `❌ Invalid script name: "${scriptName}". Available scripts: ${Object.keys(scriptMap).join(', ')}`,
    );
    process.exit(1);
  }

  try {
    await script();
    console.info(`✅ Script "${scriptName}" executed successfully.`);
    process.exit(1);
  } catch (error) {
    console.error(`❌ Error executing script "${scriptName}":`, error);
    process.exit(1);
  }
};

const run = async () => {
  const scriptName = process.argv[2];

  if (!scriptName) {
    console.error('❌ No script name provided. Usage: npm run execute <scriptName>');
    process.exit(1);
  }

  await connectDB();
  await executeScript(scriptName);
};

run();
