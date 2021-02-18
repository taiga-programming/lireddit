import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
// import { Post } from './entities/post';
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from "./resolvers/user";


const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  
  const app = express();
  
  const apollloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: () => ({em: orm.em})
  })

  apollloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    app.get('/', (_, res) => {
      res.send('bye');
    })
    console.log('server started on local host 4000');
  })
}

main().catch((error) => {
  console.log(error);
})