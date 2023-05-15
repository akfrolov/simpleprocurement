import { Module } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { RequestsController } from "./requests.controller";
import { MongooseModule } from "@nestjs/mongoose";
// import { Connection } from "mongoose";
import { Request, RequestSchema } from "./requests.schema";
import { AutoIncrementID } from "@typegoose/auto-increment";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  imports: [
    AuthModule,
    MongooseModule.forFeatureAsync([
      {
        name: Request.name,
        useFactory: (
          // connection: Connection
        ) => {
          const schema = RequestSchema;

          // const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrementID, {
            field: "_identifier"
          });

          return schema;
        }
        // inject: [getConnectionToken()]
      }
    ])
  ]
})
export class RequestsModule {
}
