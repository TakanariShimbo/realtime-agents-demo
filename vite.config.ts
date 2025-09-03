import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const [owner, repo] = (process.env.GITHUB_REPOSITORY || ":").split("/");
const isActions = !!process.env.GITHUB_ACTIONS;
const isUserSite = repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const base = isActions ? (isUserSite ? "/" : `/${repo}/`) : "/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
});
