import {
    Controller,
    Get,
    Request,
    Post,
    UseGuards,
    Body,
    Res,
    HttpStatus,
    Req,
  } from '@nestjs/common';
import { ChartService } from './chart.service';
  @Controller('chart')
  export class ChartController {
    constructor(private readonly chartService: ChartService) {}
  
    @Post('symptom/now/d')
    async get_symtom_now(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_symptom_now_day(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('product/now/d')
    async get_product_now(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_product_now_day(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
    @Get('user/now/d')
    async get_user_now(
      @Res() res,
    ) {
      let result = await this.chartService.get_user_now_day()
      return res.status(HttpStatus.OK).json(result);
    }
    @Get('order/now/d')
    async get_order_now(
      @Res() res,
    ) {
      let result = await this.chartService.get_order_now_day()
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('general/now/d')
    async get_general_now(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_general_now_day(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('all/now/d')
    async get_all_now(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_all_now_day(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('all/now/m')
    async get_all_now_m(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_all_now_mouth(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('symptom/now/m')
    async get_symtom_mouth(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let date = this.chartService.get_date();
      let mouth = await this.chartService.getIDMouth(date.month);
      let result = await this.chartService.get_symptom_now_mouth(disease_id, mouth.chart_m_id);
      let response = {date : date.month , data : result[0].symptom.data}
      return res.status(HttpStatus.OK).json(response);
    }
    @Post('product/now/m')
    async get_product_mouth(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let date = this.chartService.get_date();
      let mouth = await this.chartService.getIDMouth(date.month);
      let result = await this.chartService.get_product_now_mouth(mouth.chart_m_id,disease_id);
      let response = {date : date.month , data : result[0].product.data}
      return res.status(HttpStatus.OK).json(response);
    }
    @Get('user/now/m')
    async get_user_mouth(
      @Res() res,
    ) {
      let date = this.chartService.get_date();
      let mouth = await this.chartService.getIDMouth(date.month);
      let result = await this.chartService.get_user_now_mouth(mouth.chart_m_id);
      let response = {date : date.month , data : result}
      return res.status(HttpStatus.OK).json(response);
    }
    @Get('order/now/m')
    async get_order_mouth(
      @Res() res,
    ) {
      let date = this.chartService.get_date();
      let mouth = await this.chartService.getIDMouth(date.month);
      let result = await this.chartService.get_order_now_mouth(mouth.chart_m_id);
      let response = {date : date.month , data : result}
      return res.status(HttpStatus.OK).json(response);
    }
    @Post('general/now/m')
    async get_general_mouth(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let date = this.chartService.get_date();
      let mouth = await this.chartService.getIDMouth(date.month);
      let result = await this.chartService.get_general_now_mouth(disease_id, mouth.chart_m_id);
      let response = {date : date.month , data : result.data}
      return res.status(HttpStatus.OK).json(response);
    }
    @Post('mock')
    async mocl(
      @Body('product') product,
      @Body('products') products,
      @Body('date') date,
      @Body('chart_m_id') chart_m_id,

      @Res() res,
    ) {
      let result = await this.chartService.mock(chart_m_id,date,product,products);
      return res.status(HttpStatus.OK).json(result);
    }
    @Get('user/now/y')
    async get_user_year(
      @Res() res,
    ) {
      let result = await this.chartService.get_user_now_year();
      return res.status(HttpStatus.OK).json(result);
    }
    @Get('order/now/y')
    async get_order_year(
      @Res() res,
    ) {
      let result = await this.chartService.get_order_now_year();
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('general/now/y')
    async get_general_year(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_general_now_year(disease_id);
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('product/now/y')
    async get_product_year(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_product_now_year(disease_id);
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('symptom/now/y')
    async get_symptom_year(
      @Body('disease_id') disease_id,

      @Res() res,
    ) {
      let result = await this.chartService.get_symptom_now_year(disease_id);
      return res.status(HttpStatus.OK).json(result);
    }
    @Post('all/now/y')
    async get_all_now_year(
      @Body('disease_id') disease_id,
      @Res() res,
    ) {
      let result = await this.chartService.get_all_now_year(disease_id)
      return res.status(HttpStatus.OK).json(result);
    }
}  