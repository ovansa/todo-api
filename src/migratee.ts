import mongoose from 'mongoose';
import util from 'util';
import { exec } from 'child_process';

const execPromise = util.promisify(exec);

const changelogSchema = new mongoose.Schema({
  fileName: String,
  appliedAt: { type: Date, default: Date.now },
});

const Changelog = mongoose.model('Changelog', changelogSchema);

async function getAppliedMigrations() {
  const appliedMigrations = await Changelog.find().exec();
  return appliedMigrations.map((migration) => migration.fileName);
}

async function runMigrations() {
  try {
    // Connect to MongoDB
    await mongoose.connect('');

    const appliedMigrations = await getAppliedMigrations();

    console.log('Applied Migrations:', appliedMigrations);

    // Check for migration files in the migrations directory
    const { stdout, stderr } = await execPromise(`ls ${MIGRATIONS_DIR}`);
    if (stderr) {
      console.error('Error listing migration files:', stderr);
      process.exit(1);
    }

    const migrationFiles = stdout.split('\n').filter((file) => file.endsWith('.js'));
    const pendingMigrations = migrationFiles.filter((file) => !appliedMigrations.includes(file));

    if (pendingMigrations.length === 0) {
      console.log('No new migrations to apply.');
      return;
    }

    console.log('Pending Migrations:', pendingMigrations);

    // Run the migrations
    console.log('Running migrations...');
    await execPromise('npx migrate-mongo up');
    console.log('Migrations completed successfully');

    // Record applied migrations
    const migrationPromises = pendingMigrations.map((file) => {
      return Changelog.create({ migrationName: file });
    });
    await Promise.all(migrationPromises);

    console.log('Migration records updated successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
