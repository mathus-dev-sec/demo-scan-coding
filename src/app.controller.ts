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

  @Get("secret")
  getSecret() {
    const apiKey = "123456SECRET"; // ❌ Hardcoded secret
    return { apiKey };
  }

  // ตัวอย่าง 1: XSS risk (high)
  @Get("greet")
  greet(@Query("name") name: string) {
    // ❌ User input ส่งกลับ HTML โดยตรง
    return `<h1>Hello ${name}</h1>`;
  }

  // ตัวอย่าง 2: Path traversal (high)
  @Get("file")
  readFile(@Query("filename") filename: string) {
    const fs = require("fs");
    // ❌ User input ถูกใช้ตรง ๆ ใน path
    return fs.readFileSync(`/var/data/${filename}`, "utf8");
  }

  // ตัวอย่าง 3: Dangerous eval with sanitize (high)
  @Get("calc")
  calc(@Query("expr") expr: string) {
    // ✔ ไม่ใช่ critical เพราะเราทำ sanitize แบบ basic
    if (/[^0-9+\-*/(). ]/.test(expr)) {
      throw new Error("Invalid characters");
      //tset
    }
    return eval(expr); // high, เพราะยังเสี่ยง
  }
}
