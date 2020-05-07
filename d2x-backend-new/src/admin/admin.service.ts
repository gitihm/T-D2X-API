import { Injectable, Inject, All } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Product } from '../product/model/product.model';
import { CustomerService } from 'src/customer/customer.service';
import {
  ChartGeneral,
  ChartSymptom,
  ChartProduct,
  ChartMonth,
  ChartYear,
  ChartOrder,
  ChartUser,
} from '../chart/model/chart.model';
import { SymptomTest } from 'src/symptom/model/symptom.model';
import { MapProduct } from 'src/symptom/model/map.product.model';
import { MESSAGE } from 'src/config/message/global.configure';
var moment = require('moment');
@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly customerService: CustomerService,
    @Inject('mapRepo')
    private readonly mapcodewithdrugRepo: typeof Map,
    @Inject('ChartGeneralRepo')
    private readonly chartGeneralRepo: typeof ChartGeneral,
    @Inject('ChartSymptomRepo')
    private readonly chartSymptomRepo: typeof ChartSymptom,
    @Inject('ChartProductRepo')
    private readonly chartProductRepo: typeof ChartProduct,
    @Inject('ChartMonthRepo')
    private readonly chartMonthRepo: typeof ChartMonth,
    @Inject('ChartYearRepo')
    private readonly chartYearRepo: typeof ChartYear,
    @Inject('ProductRepo')
    private readonly productRepo: typeof Product,
    @Inject('ChartOrderRepo')
    private readonly chartOrderRepo: typeof ChartOrder,
    @Inject('ChartUserRepo')
    private readonly chartUserRepo: typeof ChartUser,
    @Inject('SymptomTestRepo')
    private readonly symptomTestRepo: typeof SymptomTest,
    @Inject('mapProductRepo')
    private readonly mapProductRepo: typeof MapProduct,
  ) {
    
  }
  
  async changeprivilege(username: string) {
    return await this.usersService.change_privilege(username);
  }
  async getmapProduct(symptom_id: number,disease_id :number) {
    let mapid = await this.mapProductRepo.findAll({
      where: { symptom_id ,disease_id},
      raw: true,
    });
    let promises = [];
    mapid.forEach(item => {
      promises.push(this.get_detail_map(item));
    });
    let result = await Promise.all(promises);
    return result;
  }
  private async get_detail_map(item) {
    if (!item.symptom_id || !item.product_id || !item) {
      return null;
    } else {
      let name_s = await this.symptomTestRepo.findOne({
        where: {
          symptom_id: item.symptom_id,
        },
        raw: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      let name_p = await this.productRepo.findOne({
        where: { product_id: item.product_id },
        raw: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      if ((name_s != null)) {
        name_s.name = JSON.parse(name_s.name);
      }
      return { map_id: item.map_id, symptom: name_s, product: name_p };
    }
  }
  async removemapProductAll(symptom_id: number, disease_id: number){
    await this.mapProductRepo.destroy({where:{
      symptom_id,
      disease_id,
    }})
  }
  async createmapProduct(symptom_id: number, product_id: number, disease_id: number) {
    let s = await this.symptomTestRepo.findOne({
      where: {
        symptom_id: symptom_id,
      },
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    let p = await this.productRepo.findOne({
      where: {
        product_id,
      },
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    
    if(s!=null&&p!=null){
     
       await this.mapProductRepo.create({
        symptom_id,
        product_id,
        disease_id,
      });
      
      return MESSAGE.CREATE_MAP_SUCCEED
    }else{
      return MESSAGE.NOT_FOUND
    }
    
  }
  async updatemapProduct(
    map_id: number,
    symptom_id: number,
    product_id: number,
  ) {
    const data = await this.mapProductRepo.findByPk(map_id);
    if (data) {
      await this.mapProductRepo.update(
        {
          symptom_id,
          product_id,
        },
        {
          where: { map_id },
        },
      );
      return MESSAGE.UPDATE_SUCCEED;
    } else {
      return MESSAGE.UPDATE_FAILED;
    }
  }
  async deleltemapProduct(symptom_id: number) {
    const data = await this.mapProductRepo.findAll({where:{symptom_id}});
    if (data.length!=0) {
      data.forEach( async v=>{
        await v.destroy()
      })
      return  true
    }
    return false;
  }
  
  async getOrderAll() {
    return await this.customerService.get_all_order(['orderproduct']);
  }
  async getOrderbystatus(status_id: number) {
    return await this.customerService.get_order_by_status(status_id, [
      'orderproduct',
    ]);
  }
  async getOrderByid(order: any) {
    return await this.customerService.get_order_by_id(order, ['orderproduct']);
  }

  
}
