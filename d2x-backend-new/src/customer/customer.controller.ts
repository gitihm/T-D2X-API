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
    UseInterceptors,
    UploadedFiles,
    Req,
  } from '@nestjs/common';
  import { CustomerService } from './customer.service';
  import { AuthGuard } from '@nestjs/passport';
  import { AdminGuard } from '../auth/guards/AdminGuard';
  import { MemberGuard } from '../auth/guards/MemberGuard';
  import { async } from 'rxjs/internal/scheduler/async';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import multerConfig from '../config/pathfile/multer.payment.config';
  import { request } from 'https';
  import { AuthService } from '../auth/auth.service';
  import { Config } from "../config/config";
  @Controller('customer')
  export class CustomerController {
    constructor(
      private readonly customerService: CustomerService,
      private readonly authService: AuthService,
      ) {}
  
    @UseGuards(MemberGuard)
    @Post('order')  
    async createOrder(
      @Req() req,
      @Body('product') product,
      @Body('address') address,
      @Body('phonenumber') phonenumber,
      @Body('delivery') delivery,
      @Res() res,
    ) {
      let status = HttpStatus.OK;
      let user = await this.authService.validateToken(req.headers.authorization.split(' ')[1])
      let result = await this.customerService.create_order(user.username,address,phonenumber,delivery,product)
      return res.status(status).json(result);
    }
    @UseGuards(MemberGuard)
    @Post('all')
    async getMyOrder(
      @Req() req,
      @Res() res,
    ) {
      let status = HttpStatus.OK;
      let user = await this.authService.validateToken(req.headers.authorization.split(' ')[1])
      let result = await this.customerService.get_my_order(user.username,['orderproduct'])
      return res.status(status).json(result);
    }
    @UseGuards(MemberGuard)
    @Post('manage')
    async manage(
      @Body('status') status,  // 1 is confirm 0 is cancel
      @Body('type') type, 
      @Body('order_id') order, 
      @Res() res,
    ) {
      let result = await this.customerService.manage(status,type,order)
      return res.status(HttpStatus.OK).json(result);
    }
  
    @UseGuards(MemberGuard)
    @Post('payment')
    async payment(
      @Req() req,
      @Body('img') img, 
      @Body('order_id') order, 
      @Res() res,
    ) {
      
      let user = await this.authService.validateToken(req.headers.authorization.split(' ')[1])
      let result = await this.customerService.payment(img,order,user)
  
      return res.status(HttpStatus.OK).json(result);
    }
  
    @UseGuards(MemberGuard)
    @Post('payment/img')
    @UseInterceptors(FilesInterceptor('img', 1, multerConfig))
  async upload_image(@UploadedFiles() file, @Res() res) {
      let status = HttpStatus.OK;
      let response = {
        photo: `${Config.apipath.host}/customer/payment/img/` + file[0].filename,
      };
      return res.status(status).json(response)
    }
  
    
    @Get('payment/img/:path')
    seeUploadedFile(@Param('path') Image, @Res() res) {
      return res.sendFile(Image, { root: `../img${Config.ImagePath.payment}` });
    }
  }
  