import os from "os";
import path from "path";

/** Local dirs outside Dropbox to avoid EPERM file locks on Windows. */
export const APP_CACHE_ROOT = path.join(
  process.env.LOCALAPPDATA || os.homedir(),
  "a-inman-languages",
);

export const NEXT_DIST_DIR = path.join(APP_CACHE_ROOT, "next-dist");
export const APP_DATA_DIR = path.join(APP_CACHE_ROOT, "data");
