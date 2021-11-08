import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*   app.enableCors({
    origin: "http://localhost:3001, https://kyoka.vercel.app/",
    methods: "GET, PUT, PATCH, POST, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  }); */
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
