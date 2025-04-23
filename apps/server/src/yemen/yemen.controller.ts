import { Body, Controller, Headers, Post, UnauthorizedException } from "@nestjs/common";

import { ImportCVRequestDto } from "./dtos/import-cv.request.dto";
import { ImportCvResponseDto } from "./dtos/import-cv.response.dto";
import { YemenService } from "./yemen.service";

@Controller("yemen")
export class YemenController {
  constructor(private readonly yemenService: YemenService) {}

  @Post("import-cv")
  async importCV(
    @Headers("x-api-key") apiKey: string,
    @Body() body: ImportCVRequestDto,
  ): Promise<ImportCvResponseDto> {
    const isValid = this.yemenService.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException("Invalid API key");
    }

    const resume = await this.yemenService.importCv(body);

    return {
      resumeId: resume.id,
      shareUrl: `/r/${resume.slug}`,
      editUrl: `/builder/${resume.id}`,
      previewUrl: `/preview/${resume.id}`,
    };
  }
}
