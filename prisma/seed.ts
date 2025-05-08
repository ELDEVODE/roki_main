import { seedDefaultRoles } from "./seed/seed";

async function main() {
  await seedDefaultRoles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
