// Dynamically import all handler modules from ./modules
const modules = import.meta.glob("./modules/*.ts", { eager: true });

export const handlers = Object.values(modules).flat();
