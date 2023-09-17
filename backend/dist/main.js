"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Craftimity")
        .setDescription(`Craftimity is your go-to platform for all things craftsmanship and home improvement. We connect skilled artisans, tradespeople, and DIY enthusiasts with homeowners and businesses in need of their services. Our mission is to make it easy for 
      you to find the right professionals for your projects, from plumbing and carpentry to electrical work and more.`)
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {});
    swagger_1.SwaggerModule.setup("api", app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    app.use((0, helmet_1.default)());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map