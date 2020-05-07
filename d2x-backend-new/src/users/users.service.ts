import { Injectable, Inject } from '@nestjs/common';
import { Users, Token, Disease } from './model/users.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepo') private readonly usersRepo: typeof Users,
    @Inject('TokenRepo') private readonly tokenRepo: typeof Token,
    @Inject('DiseaseRepo') private readonly diseaseRepo: typeof Disease,
    private readonly jwtService: JwtService,
  ) {
    this.usersRepo.addScope('token', {
      include: [{ model: Token, separate: true,as : 'accessTokens'}],
    });
    this.usersRepo.addScope('disease', {
      include: [{ model: Disease, separate: true ,as:'diseases' }],
      attributes: {
        exclude: ['password'],
      },

    });
  }
  async find_user_one(options: any) {
    return await this.usersRepo.scope({}).findOne({
      where: { [`${options.type}`]: options.data },
      raw: true,
    });
  }
  async find_users(options) {
    if (options.length == 0) {
      return await this.usersRepo.scope(options).findAll({ raw: true });
    } else {
      return await this.usersRepo.scope(options).findAll();
    }
  }
  async create_user(user: any) {
    if (user.username.length < 4) {
      return { message: 'username must be longer than 4' };
    }
    if (user.password.length < 6) {
      return { message: 'password must be longer than 6' };
    }
    if (await this.find_user_one({ type: 'username', data: user.username })) {
      return { message: 'already have this username' };
    }
    if (await this.find_user_one({ type: 'email', data: user.email })) {
      return { message: 'already have this email' };
    }
    user.password = this.generator_hash(user.password);
    user.role = 0;
    await this.usersRepo.create(user);
    return { message: 'create user succeed' };
  }
  private generator_hash(password: string) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  async change_privilege(username: string) {
    let user = await this.find_user_one({ type: 'username', data: username });
    if (!user) return { error: 'user not found' };
    let role = (user.role + 1) % 2;
    await this.usersRepo.update(
      {
        role
      },
      {
        where: { user_id: user.user_id },
      },
    );
    return { message: 'change privilege succeed' };
  }

  async edit_data_user_something(options: any, user: any){
    await this.usersRepo.update(
      { [`${options.type}`]: options.data },
      { where: { user_id: user.sub } },
    );
    user = await this.find_user_one({ type: 'username', data: user.username });
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      address: user.address,
      phone: user.phoneNumber,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);
    await this.add_token(user, token);
    const new_token = {
      user_id: user.user_id,
      token: token,
    };
    await this.tokenRepo.create(new_token);
    return { access_token: token, payload };
  }
  async edit_data_user_all(data: any, user: any, access_token: string) {
    let promise = [];
    promise.push(
      this.edit_data_user_something({ type: 'fname', data: data.fname }, user),
    );
    promise.push(
      this.edit_data_user_something({ type: 'lname', data: data.lname }, user),
    );
    promise.push(
      this.edit_data_user_something({ type: 'address', data: data.address }, user),
    );
    promise.push(
      this.edit_data_user_something(
        { type: 'phoneNumber', data: data.phonenumber },
        user,
      ),
    );
    promise.push(this.remove_token(access_token));
    await Promise.all(promise); // if update return obj user should not find user one
    user = await this.find_user_one({ type: 'username', data: user.username });
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      address: user.address,
      phone: user.phoneNumber,
      fname: user.fname,
      lname: user.lname,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);
    await this.add_token(user, token);
    const new_token = {
      user_id: user.user_id,
      token: token,
    };
    await this.tokenRepo.create(new_token);
    return { access_token: token, payload };
  }
  async add_token(user: any, access_token: string) {
    user = await this.find_user_one({ type: 'username', data: user.username });
    if (!user) return { error: 'user not found' };
    const new_token = {
      user_id: user.user_id,
      token: access_token,
    };
    return await this.tokenRepo.create(new_token);
  }
  async check_token(access_token: string) {
    const token_user = await this.tokenRepo.findOne({
      where: { token: access_token },
    });
    if (!token_user) return false;
    return true;
  }
  async remove_token(access_token: string) {
    const token_user = await this.tokenRepo.destroy({
      where: { token: access_token },
    });
    if (!token_user) return { error: 'token is ban' };
    return { message: 'singout succeed' };
  }
  async add_disease(diseases: any, user: any) {
    user = await this.find_user_one({ type: 'username', data: user.username });
    if (!user) return { error: 'user not found' };
    const promise = [];
    diseases.forEach(disease => {
      promise.push(this.add_disease_in_db(disease, user.user_id));
    });
    await Promise.all(promise);
    return { message: 'create disease' };
  }
  private async add_disease_in_db(disease: string, user_id: number) {
    await this.diseaseRepo.create({
      user_id,
      disease,
    });
  }
  async update_photo(img, user) {
    user = await this.find_user_one({ type: 'username', data: user.username });
    if (!user) return { error: 'user not found' };
    await this.usersRepo.update(
      {
        photo: img, 
      },
      {
        where: { user_id: user.user_id },
      },
    );
    return { message: 'update img' };
  }
           
}
