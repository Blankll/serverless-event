import { app } from "./app";
import { server } from "./graphql";


export const handler = server.createHandler({
    expressAppFromMiddleware(middlewares) {
        app.use(middlewares)
        return app
    },
    expressGetMiddlewareOptions: {
        path: '/graphql'
    }
});