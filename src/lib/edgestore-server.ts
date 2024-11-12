import { initEdgeStoreClient } from "@edgestore/server/core";
import { initEdgeStore } from "@edgestore/server";
import {
  type CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";
const es = initEdgeStore.create();
// ...
//
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket({
    maxSize: 1024 * 1024 * 10, // 10MB
    // accept: ["application/pdf"],
  }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// ...

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});
