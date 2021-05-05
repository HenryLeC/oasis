import "reflect-metadata";
import { config } from "dotenv";
config();

import express from "express";
import { createConnection } from "typeorm";
import { createApolloServer } from "./apolloServer";
import authRouter from "./modules/auth";
import expressSession from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { ormconfig } from "./ormconfig";
import passport from "passport";

const RedisStore = connectRedis(expressSession);

const redisClient = createClient(process.env.OASIS_API_REDIS_URL);

export const createApp = async () => {
  const app = express();

  await createConnection(ormconfig);
  const apolloServer = await createApolloServer();

  /* Express-Session configuration */
  app.use(
    expressSession({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.OASIS_API_SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: null },
    })
  );

  /* Passport configuration */
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  /* Authentication API */
  app.use("/api/auth", authRouter(passport));

  /* Apollo GraphQL Server */
  apolloServer.applyMiddleware({ app });

  return app;
};

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  createApp().then((app) => {
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}/graphql`)
    );
  });
}
