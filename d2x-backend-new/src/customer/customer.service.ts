import { Injectable, Inject, Options } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';
import { Order, OrderProduct } from './model/customer.model';
import { MESSAGE } from '../config/message/global.configure';
import { ChartService } from 'src/chart/chart.service';
import { TasksService } from '../tasks/tasks.service';
var moment = require('moment');
enum MANAGE {
  MEMBER,
  ADMIN,
}
@Injectable()
export class CustomerService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
    @Inject('orderRepo') private readonly orderRepo: typeof Order,
    @Inject('orderProductRepo')
    private readonly orderProductRepo: typeof OrderProduct,
    private readonly chartService: ChartService,
    private readonly TasksService: TasksService,
  ) {
    this.orderRepo.addScope('orderproduct', {
      include: [{ model: OrderProduct, separate: true, as: 'products' }],
    });
  }
  private cal_price_product(product: any, count) {
    return this.calcTotalPrice(product.price, count);
  }
  private arrSum = arr => arr.reduce((a, b) => a + b, 0);
  async create_order(
    username: string,
    address: string,
    phonenumber: string,
    delivery: string,
    product: any,
  ) {
    let user = await this.usersService.find_user_one({
      type: 'username',
      data: username,
    });
    let sum = 0,
      total = 0;
    if (!user) return MESSAGE.USER_NOT_FOUND;
    const promise = [];
    for (let i = 0; i < product.length; i++) {
      promise.push(
        this.cal_price_product(
          await this.productService.get_product(product[i].product_id),
          product[i].count,
        ),
      );
    }
    let result = await Promise.all(promise);
    total = this.arrSum(result);
    let countOrder = await this.getCountOrder();
    let id;

    if (countOrder.count == 0) {
      id = '#0';
    } else {
      id = '#' + countOrder.rows[countOrder.count - 1].order_id;
    }

    let status = await this.orderRepo.create({
      order: id,
      username,
      phonenumber,
      statusorder: 0,
      statususer: 0,
      delivery,
      address,
      allprice: total,
      photo: '',
    });
    if (status) {
      let order = await this.orderRepo.findOne({
        where: { order: id },
        raw: true,
      });
      const promise_create_product = [];
      for (let i = 0; i < product.length; i++) {
        promise_create_product.push(
          this.create_order_product(
            order,
            product[i].product_id,
            product[i].count,
          ),
        );
      }
      await Promise.all(promise_create_product);
    }
    try {
      await this.chartService.increment_order();
    } catch (error) {
      await this.TasksService.create_null_chart_day();
      await this.chartService.increment_order();
    }
    return { message: 'complete order' };
  }
  private async create_order_product(
    order: any,
    product_id: number,
    count: number,
  ) {
    let item = await this.productService.get_product(product_id);
    await this.orderProductRepo.create({
      order_id: order.order_id,
      photo: item.photo,
      name: item.name,
      count: count,
      price: item.price,
    });
    try {
      await this.chartService.increment_product(product_id);
    } catch (error) {
      await this.TasksService.create_null_chart_day();
      await this.chartService.increment_product(product_id);
    }
  }
  async getCountOrder() {
    return await this.orderRepo.findAndCountAll();
  }
  private async calcTotalPrice(price: number, count: number) {
    return price * count;
  }
  async get_my_order(username: string, options: any) {
    let all_order = await this.orderRepo.scope(options).findAll({
      where: { username },
    });
    all_order = this.data_value_to_array(all_order);
    return await this.set_time(all_order);
  }
  private async set_time(order: any) {
    const promise = [];
    for (let i = 0; i < order.length; i++) {
      promise.push(await this.updatetime(order[i]));
    }
    let result = await Promise.all(promise);

    return result;
  }
  private async updatetime(order: any) {
    let created = moment(order.createdAt)
      .tz('Asia/Bangkok')
      .format();
    let updated = moment(order.updatedAt)
      .tz('Asia/Bangkok')
      .format();
    order['created'] = created;
    order['updated'] = updated;
    delete order.updatedAt;
    delete order.createdAt;
    delete order.deletedAt;
    return order;
  }
  async manage(status: number, type: string, order: string) {
    if (type == 'admin') {
      let s = await this.manageWithAdmin(status, order);
      return s[0] === 1
        ? { message: 'update succeed' }
        : { message: 'update failed' };
    } else if (type == 'member') {
      let s = await this.manageWithMember(status, order);
      return s[0] === 1
        ? { message: 'update succeed' }
        : { message: 'update failed' };
    }
  }
  private async manageWithAdmin(status: number, order: string) {
    return await this.orderRepo.update(
      {
        statusorder: status % 6,
      },
      {
        where: { order: order },
      },
    );
  }
  private async manageWithMember(status: number, order: string) {
    return await this.orderRepo.update(
      {
        statususer: status % 3,
      },
      {
        where: { order: order },
      },
    );
  }
  async payment(img: string, order: string, user: any) {
    let result = await this.orderRepo.update(
      {
        photo: img,
      },
      {
        where: { order: order },
      },
    );

    return result;
  }
  async get_all_order(options: any) {
    return await this.orderRepo.scope(options).findAll();
  }
  private data_value_to_array(data_value: any) {
    return JSON.parse(JSON.stringify(data_value, null, 4));
  }
  async get_order_by_status(status_num: number, options: any) {
    let all_order = await this.orderRepo.scope(options).findAll();
    all_order = this.data_value_to_array(all_order);
    return all_order.filter(order => order.statusorder == status_num);
  }
  async get_order_by_id(order: string, options: any) {
    return await this.orderRepo.scope(options).findOne({
      where: { order: order },
    });
  }
}
