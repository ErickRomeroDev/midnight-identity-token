import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { auctions } from "@/server/db/schema";

export const getTableRouter = createTRPCRouter({
  getMany: publicProcedure    
    .query(async ({ ctx }) => {
      const data = await ctx.db.select().from(auctions)
      return data;
    }),
});
