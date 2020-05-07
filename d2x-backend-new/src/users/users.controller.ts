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
import multerConfig from '../config/pathfile/multer.user.config';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { MemberGuard } from '../auth/guards/MemberGuard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Config } from "../config/config";

require('dotenv').config()
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(MemberGuard)
  @Post('edit')
  async edit_data(
    @Req() req,
    @Body('type') type,
    @Body('data') data,
    @Res() res,
  ) {
    let user = await this.authService.validateToken(
      req.headers.authorization.split(' ')[1],
    );
    let result = await this.usersService.edit_data_user_something(
      { type, data },
      user,
    );
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(MemberGuard)
  @Post('editall')
  async edit_all_data(@Req() req, @Body() data, @Res() res) {
    let user = await this.authService.validateToken(
      req.headers.authorization.split(' ')[1],
    );
    let token = req.headers.authorization.split(' ')[1];
    let result = await this.usersService.edit_data_user_all(data, user, token);
    return res.status(HttpStatus.OK).json(result);
  }
  @UseGuards(MemberGuard)
  @Post('editdisease')
  async add_disease(@Req() req, @Body('diseases') diseases, @Res() res) {
    let status = HttpStatus.OK;
    let user = await this.authService.validateToken(
      req.headers.authorization.split(' ')[1],
    );
    let result = await this.usersService.add_disease(diseases, user);
    return res.status(status).json(result);
  }
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('img', 1, multerConfig))
  async upload_image(@UploadedFiles() file, @Res() res) {
    let status = HttpStatus.OK;
    let response = {
      photo: `${Config.apipath.host}/user/img/` + file[0].filename,
    };
    return res.status(status).json(response);
  }
  @Get('img/:path')
  see_uploaded_file(@Param('path') Image, @Res() res) {
    return res.sendFile(Image, { root:  `../img${Config.ImagePath.user}`}); 
  }

  @UseGuards(MemberGuard)
  @Post('photo')
  async add_photo(@Req() req, @Body('photo') photo, @Res() res) {
    let status = HttpStatus.OK;
    let user = await this.authService.validateToken(
      req.headers.authorization.split(' ')[1],
    );
    let response = await this.usersService.update_photo(photo, user);
    
    
    return res.status(status).json(response);
  }
}
