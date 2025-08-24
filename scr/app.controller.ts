import { Controller, Get, Query } from "@nestjs/common";
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

  @Get("unsafe-eval")
  unsafeEval(@Query("code") code: string) {
    // ⚠️ Semgrep จะ flag นี้เป็น critical
    return eval(code);
  }

  @Get("sql-injection")
  unsafeQuery(@Query("id") id: string) {
    // ตัวอย่างการสร้าง query แบบ unsafe
    const query = `SELECT * FROM users WHERE id = ${id}`;
    return query; // Semgrep จะถือเป็น critical security issue
  }
}
