import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "nestjs-prisma";
import slugify from "slugify";

import { ResumeService } from "../resume/resume.service";
import { UserService } from "../user/user.service";
import { ImportCVRequestDto } from "./dtos/import-cv.request.dto";
import { ResumeDto } from "@reactive-resume/dto";

@Injectable()
export class YemenService {
  private readonly YEMEN_USER_ID: string;
  private readonly YEMEN_USER_EMAIL: string;
  private readonly YEMEN_JWT_SECRET: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly resumeService: ResumeService,
    private readonly userService: UserService,
  ) {
    this.YEMEN_USER_ID = this.configService.get<string>("YEMEN_USER_ID") ?? "";
    this.YEMEN_USER_EMAIL = this.configService.get<string>("YEMEN_USER_EMAIL") ?? "";
    this.YEMEN_JWT_SECRET = this.configService.get<string>("YEMEN_JWT_SECRET") ?? "";
  }

  validateApiKey(apiKey: string): boolean {
    const expectedApiKey = this.configService.get("YEMEN_JWT_SECRET");
    return apiKey === expectedApiKey;
  }

  async getOrCreateYemenUser() {
    const user = await this.prisma.user.findUnique({
      where: { id: this.YEMEN_USER_ID },
    });

    if (user) {
      return user;
    }

    return await this.userService.create({
      id: this.YEMEN_USER_ID,
      email: this.YEMEN_USER_EMAIL,
      name: "Yemen User",
      username: "yemen-user",
      emailVerified: true,
      locale: "en",
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: "email",
    });
  }

  async importCv({ resumeData, metadata }: ImportCVRequestDto) {
    const user = await this.getOrCreateYemenUser();

    const title = (metadata as { title?: string }).title ?? "Yemen CV";
    const slug = slugify(title, {
      lower: true,
    });
    return await this.resumeService.import(user.id, {
      title,
      slug,
      data: resumeData,
    });
  }
}
