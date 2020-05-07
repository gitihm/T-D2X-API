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
  Req,
  UseGuards
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { AdminGuard } from '../auth/guards/AdminGuard';
//build 2.0.2
@Controller('question')
export class QuestionTestController {
  constructor(private readonly questionService: QuestionService) {}
  @Get('/ml')
  async gettest( @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.questionService.getTest()
    
    return res.status(status).json(response);
  }
  @Get('/:disease_id')
  async getQuestions(@Req() req, @Param('disease_id') disease_id, @Res() res) {
    let status = HttpStatus.OK;
    let response = {};
    const question = await this.questionService.getQuestions(
      ['choice'],
      disease_id,
    );
    response = { question };
    return res.status(status).json(response);
  }
  
  @UseGuards(AdminGuard)
  @Post()
  async createQuestions(
    @Req() req,
    @Body('disease_id') disease_id,
    @Body('question') questions,
    @Body('choice') choices,
    @Res() res,
  ) {
    let status = HttpStatus.OK;
    const response = await this.questionService.create_questions(
      questions,
      choices,
      disease_id,
    );
    return res.status(status).json(response);
  }

  
}
