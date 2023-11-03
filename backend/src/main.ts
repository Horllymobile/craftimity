import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import * as csurf from "csurf";
import helmet from "helmet";
import { CountryModule } from "./resources/country/country.module";
import { StateModule } from "./resources/state/state.module";
import { CityModule } from "./resources/city/city.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const countryConfig = new DocumentBuilder()
    .setTitle("Crafimity")
    .setDescription("The Country API description")
    .setVersion("1.0")
    .addTag("Country")
    .build();

  const countryDocument = SwaggerModule.createDocument(app, countryConfig, {
    include: [CountryModule, StateModule, CityModule],
  });
  SwaggerModule.setup("api", app, countryDocument);

  app.useGlobalPipes(new ValidationPipe());
  // app.use(csurf());
  app.enableCors();
  app.use(helmet());
  await app.listen(process.env.PORT);
}
bootstrap();

// "engines": {
//   "node": "18.17.1",
//   "npm": "9.6.7"
// }

// "engines": {
//   "node": "18.13.0",
//   "npm": "9.6.7"
// }

// "engines": {
//   "node": "18.18.0",
//   "npm": "9.6.7"
// }
// v=spf1 include:spf.efwd.registrar-servers.com ~all

// v=spf1 include:spf.efwd.registrar-servers.com include:_spf.mailersend.net ~all
