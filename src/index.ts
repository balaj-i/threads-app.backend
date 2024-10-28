import express, { Request, Response } from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'

async function init() {
    const app = express();

    const gqlserver = new ApolloServer({
        typeDefs: `
        type Query{
            hello:String,
            say(name:String):String
        }`,
        resolvers: {
            Query: {
                hello: () => `hey there,i am graphql server`,
                say:(_,{name}:{name:String})=> `hey ${name},wassup?`
            },
        }
    })
    app.use(express.json())
    await gqlserver.start()

    app.get('/', (req: Request, res: Response) => {
        res.json({ message: "threads backend" });
    });
    app.use('/graphql', expressMiddleware(gqlserver))

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

}

init()