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
    UploadedFiles,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { async } from 'rxjs/internal/scheduler/async';
  import multerConfig from '../config/pathfile/multer.product.config';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { Config } from "../config/config";
  
  @Controller('product')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
    @Get()
    async getProducts(@Res() res) {
      let status = HttpStatus.OK;
      const product = await this.productService.get_products();
      let response = { product };
      return res.status(status).json(response);
    }
    @Get(':id') 
    async getProduct(@Param('id') id,@Res() res) {
      let status = HttpStatus.OK;
      const product = await this.productService.get_product(id);
      let response = { product };
      return res.status(status).json(response);
    }
    @Post()
   
    async createProduct(@Body() data, @Res() res) {
   
        let status = HttpStatus.OK;
        let response = {};
        data.help = ''

        const product = await this.productService.create_products(data);
        response = { product };
        return res.status(status).json(response);
  
    }
    @Patch()
    async updateProduct(@Body() data, @Res() res) {
  
      let status = HttpStatus.OK;
      let response = {};
      const product = await this.productService.update_product(data.id, data);
      if (product == null) {
        status = HttpStatus.BAD_REQUEST;
        response = {
          message: 'ไม่พบสินค้าดังกล่าว',
        };
      } else {
        response = { product };
      }
      return res.status(status).json(response);
    }
    @Delete('/:id')
    async removeProduct(@Param('id') product_id, @Res() res) {
      let status = HttpStatus.OK;
      let response = {};
      const product = await this.productService.delete_product(product_id);
      if (product === null) {
        status = HttpStatus.BAD_REQUEST;
        response = {
          message: 'ไม่พบสินค้าดังกล่าว',
        };
      } else {
        response = { message: 'ลบสินค้าเรียบร้อยแล้ว' };
      }
      return res.status(status).json(response);
    }
    @Post('/upload')
    @UseInterceptors(FilesInterceptor('img',1, multerConfig))
    async uploadImage(@UploadedFiles() file, @Res() res) {
      let status = HttpStatus.OK;
      let response = {
        photo: `${Config.apipath.host}/product/img/` + file[0].filename,
      };
      return res.status(status).json(response)
    }
  
    @Get('img/:path')
    seeUploadedFile(@Param('path') Image, @Res() res) {
      return res.sendFile(Image, { root: `../img${Config.ImagePath.product}`});
    }
  }
  