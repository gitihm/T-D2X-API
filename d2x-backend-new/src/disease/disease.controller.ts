import {
    Controller,
    Get,
    HttpStatus,
    Res,
    Post,
    Body,
    Delete,
    Param,
    Patch,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Req
  } from '@nestjs/common';
  import { DiseaseService } from './disease.service';
  import { AdminGuard } from '../auth/guards/AdminGuard';
  @Controller('disease')
  export class DiseaseController {
    constructor(private readonly diseaseService: DiseaseService) {}

    @Get()
    async get_disease( @Req() req, @Res() res) {
      let status = HttpStatus.OK;
      let response = await this.diseaseService.get_disease(['raw'])
      return res.status(status).json(response);
    }
    @UseGuards(AdminGuard)
    @Post()
    async createDisease( @Req() req,@Body('name') name, @Res() res) {
      let status = HttpStatus.OK;
      let response = await this.diseaseService.create_disease({name  , status : 0})
      return res.status(status).json(response);
    }
    
    @Patch()
    async updateDisease( @Req() req,@Body('disease_id') disease_id,@Body('name') name,@Body('status') status, @Res() res) {
      let status_res = HttpStatus.OK;
      let response = await this.diseaseService.update_disease(disease_id , name , status)
      return res.status(status_res).json(response);
    }
    @UseGuards(AdminGuard)
    @Delete()
    async deleteDisease( @Req() req, @Body('disease_id') disease_id , @Res() res) {
      let status = HttpStatus.OK;
      let response = await this.diseaseService.delete_disease(disease_id)
      return res.status(status).json(response);
    }
  }