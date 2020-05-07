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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { CustomerService } from '../customer/customer.service';
import { AdminGuard } from '../auth/guards/AdminGuard';
import { MemberGuard } from '../auth/guards/MemberGuard';
import { MESSAGE } from 'src/config/message/global.configure';
var moment = require('moment');
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(AdminGuard)
  @Post('privilege')
  async changeprivilege(@Body('username') username, @Res() res) {
    let result = await this.adminService.changeprivilege(username);
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(AdminGuard)
  @Get('users')
  async getUsers(@Res() res) {
    let status = HttpStatus.OK;
    let response = await this.usersService.find_users(['disease']);
    return res.status(status).json(response);
  }

  @UseGuards(AdminGuard)
  @Get('order/all')
  async getOrderAll(@Res() res) {
    let status = HttpStatus.OK;
    let response = await this.adminService.getOrderAll();
    return res.status(status).json(response);
  }
  @UseGuards(MemberGuard)
  @Post('order')
  async getOrder(@Body('order') order, @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.adminService.getOrderByid(order);
    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Post('order/bystatus')
  async getOrderbystatus(@Body('status_id') status_id, @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.adminService.getOrderbystatus(status_id);
    return res.status(status).json(response);
  }
 
  @UseGuards(AdminGuard)
  @Get('map/:symptom_id/:disease_id')
  async getCodewithdrugs(@Param('symptom_id') symptom_id,@Param('disease_id') disease_id,@Res() res) {
    let status = HttpStatus.OK;
    let response = await this.adminService.getmapProduct(symptom_id,disease_id);
    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Post('map')
  async createmapProduct(
    @Body('symptom_id') symptom_id,
    @Body('product_id') product_id,
    @Body('disease_id') disease_id,
    @Res() res,
  ) {
    let status = HttpStatus.OK;
    let result 
    let promises = []
    await this.adminService.removemapProductAll(symptom_id,disease_id)
    product_id.map(async item => {
      promises.push(this.adminService.createmapProduct(symptom_id, item,disease_id));
    });
    result = await Promise.all(promises)
    let status_create = result.map(item=>{
      return item.code == 29
    })
    if(status_create[0]){
      return res.status(status).json(MESSAGE.NOT_FOUND)
    }else{
      let result =  await this.adminService.getmapProduct(symptom_id,disease_id)
      return res.status(status).json(result)

    }
    
  }
  @UseGuards(AdminGuard)
  @Patch('map')
  async updatemapProduct(
    @Body('map_id') map_id,
    @Body('symptom_id') symptom_id,
    @Body('product_id') product_id,
    @Res() res,
  ) {
    let status = HttpStatus.OK;
    let response = await this.adminService.updatemapProduct(
      map_id,
      symptom_id,
      product_id,
    );

    return res.status(status).json(response);
  }
  @UseGuards(AdminGuard)
  @Delete('map')
  async deletemapProduct(@Body('symptom_id') symptom_id, @Res() res) {
    let status = HttpStatus.OK;
    let response = await this.adminService.deleltemapProduct(symptom_id);
    if (response != false) {
      return res.status(status).json(MESSAGE.DELETE_SUCCEED);
    } else {
      status = HttpStatus.BAD_REQUEST;
      res.status(status).json(MESSAGE.DELETE_FAILED);
    }
  }
}
