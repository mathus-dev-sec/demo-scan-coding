import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "Hello World!";
  }
  //   @Get("health")
  //   getHealth(): { status: string; timestamp: string } {
  //     return {
  //       status: "OK",
  //       timestamp: new Date().toISOString(),
  //     };
  //   }
}
