import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import * as csurf from "csurf";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Craftimity")
    .setDescription(
      `Craftimity is your go-to platform for all things craftsmanship and home improvement. We connect skilled artisans, tradespeople, and DIY enthusiasts with homeowners and businesses in need of their services. Our mission is to make it easy for 
      you to find the right professionals for your projects, from plumbing and carpentry to electrical work and more.`
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe());
  // app.use(csurf());
  app.enableCors();
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
