import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthModule } from "../auth/auth.module";
import { ResumeModule } from "../resume/resume.module";
import { UserModule } from "../user/user.module";
import { YemenController } from "./yemen.controller";
import { YemenService } from "./yemen.service";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ResumeModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.YEMEN_API_SECRET ?? "yemen-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [YemenController],
  providers: [YemenService],
  exports: [],
})
export class YemenModule {}
