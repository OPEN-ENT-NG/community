import { Injectable } from '@nestjs/common';
import { ExportRequestDto } from './dto/export-request.dto';
import { ExportAppResponseDTO } from './dto/export-response.dto';

@Injectable()
export class ExportService {
  constructor(
    // Inject other services you need
  ) {
    console.log('prout')
  }

  async exportCommunity(request: ExportRequestDto): Promise<ExportAppResponseDTO> {
      // TODO implement
      const response: ExportAppResponseDTO = {
        success: true,
        userId: request.userId,
        path: '/to/implement',
        referenceId: request.referenceId
      };
      return response;
    }
}

