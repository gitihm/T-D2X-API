import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Post,
  Body,
  Delete,
  Param,
  UploadedFiles,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ViewsService } from './views.service';
@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}
  @Get()
  async view(@Req() req, @Res() res) {
    const ipInfo = req.ipInfo;
    let views = await this.viewsService.get_count(req.clientIp)

    
    return res.status(HttpStatus.OK).json({views:views.count,ip_client:req.clientIp,ip_infor:req.ipInfo});
  }
}
