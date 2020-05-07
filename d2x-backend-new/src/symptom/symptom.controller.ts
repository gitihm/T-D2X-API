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
  UseGuards,
  Req,
} from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { AdminGuard } from '../auth/guards/AdminGuard';

@Controller('symptom')
export class SymptomController {
  constructor(private readonly symptomService: SymptomService) {}
  @UseGuards(AdminGuard)
  @Get('')
  async get_all_symptom(@Res() res) {
    let status = HttpStatus.OK;
    let response = await this.symptomService.get_all_symptom();
    return res.status(status).json(response);
  }

  @UseGuards(AdminGuard)
  @Get('/:disease_id')
  async get_symptom(@Param('disease_id') disease_id, @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.symptomService.get_symptom(disease_id);
    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Post('/test')
  async create_symptom_test(
    @Req() req,
    @Body('disease_id') disease_id,
    @Body('symptom') symptom,
    @Res() res,
  ) {
    let status = HttpStatus.OK;
    for (let i = 0; i < symptom.length; i++) {
      symptom[i].name = JSON.stringify(symptom[i].name);
    }
    return res.status(status).json({ message: 'OK' });
  }
  @UseGuards(AdminGuard)
  @Post('/')
  async create_symptom(
    @Req() req,
    @Body('disease_id') disease_id,
    @Body('symptom') symptom,
    @Res() res,
  ) {
    let status = HttpStatus.OK;
    symptom.name = JSON.stringify(symptom.name);
    await this.symptomService.step_first(disease_id, symptom);
    let response = await this.symptomService.get_symptom(disease_id);
    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Delete('/:symptom_id')
  async del_symptom(@Param('symptom_id') symptom_id, @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.symptomService.del_symptom(symptom_id);
    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Post('genera')
  async genera_symptom(@Body('disease_id') disease_id, @Res() res) {
    let status = HttpStatus.OK;
    const response = await this.symptomService.train(disease_id);
    return res.status(status).json(response);
  }
}
